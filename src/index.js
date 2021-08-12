import $ from 'jquery'
// import { MultiFormatReader, BarcodeFormat } from '@zxing/library';
import QrScanner from 'qr-scanner';
import QrScannerWorkerPath from '!!file-loader!../node_modules/qr-scanner/qr-scanner-worker.min.js';

import base45 from 'base45'
import b45 from 'base45-web'

import pako from 'pako'



const cbor2 = require('cbor-js')
const { inspect } = require('node-inspect-extracted')
const { Buffer } = require('buffer')

window.cbor2 = cbor2
window.inspect = inspect
window.Buffer = Buffer
window.b45 = b45
window.pako = pako

console.log('test')

QrScanner.WORKER_PATH = QrScannerWorkerPath;

const qrScanner = new QrScanner(document.querySelector('video'), (result) => {
    qrScanner.stop()
    document.getElementById('scanner').style.display = 'none'
    convertCovid(result)
});

function convertCovid(compressedBase45){
    document.getElementById('qrInput').value = compressedBase45
    document.getElementById('qrOutput').value = ''

    let compressed = base45.decode(compressedBase45.substr(4))
    let decompressed = pako.inflate(Buffer.from(compressed))
    console.log('decompressed: ', decompressed)
    let cose = cbor2.decode(decompressed.buffer)
    window.cose1 = cose
    console.log('cose: ', cose)
    let result0 = cbor2.decode(Buffer.from(cose[0]).buffer)
    let result2 = cbor2.decode(Buffer.from(cose[2]).buffer)

    console.log('result 0: ', result0)
    console.log('result 2: ', result2)

    window.result2 = result2

    document.getElementById('qrOutput').value = JSON.stringify(result2, null, 4)
}

$(document).ready(() => {
    $('#scan').click(() => {
        document.getElementById('scanner').style.display = 'block'
        qrScanner.start();
    })

    document.getElementById('qrInput').addEventListener('change', event => convertCovid(event.target.value))
})
