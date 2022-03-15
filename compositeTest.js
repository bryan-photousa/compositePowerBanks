const fs = require('fs'),
    gm = require('gm'),
    sharp = require('sharp')



let y = 4
let x = 4

let twoUpX = 1978;
let threeUpX = 3952;
let fourUpX = 5926;
let fiveUpX = 7900;
let sixUpX = 9874;
;
let tiffFiles = [
    '/Volumes/nas/48/Zazzle/auto_print/openprint/batch_downloaded_PowerBank_104/batch_downloaded_873875-2022-03-15/images_873875-2022-03-15/1898374_M104PD-BLK.tiff',
    '/Volumes/nas/48/Zazzle/auto_print/openprint/batch_downloaded_PowerBank_104/batch_downloaded_873875-2022-03-15/images_873875-2022-03-15/1898374_M104PD-BLK.tiff',
    '/Volumes/nas/48/Zazzle/auto_print/openprint/batch_downloaded_PowerBank_104/batch_downloaded_873875-2022-03-15/images_873875-2022-03-15/1898374_M104PD-BLK.tiff',
    '/Volumes/nas/48/Zazzle/auto_print/openprint/batch_downloaded_PowerBank_104/batch_downloaded_873875-2022-03-15/images_873875-2022-03-15/1898374_M104PD-BLK.tiff',
    '/Volumes/nas/48/Zazzle/auto_print/openprint/batch_downloaded_PowerBank_104/batch_downloaded_873875-2022-03-15/images_873875-2022-03-15/1898374_M104PD-BLK.tiff',
    '/Volumes/nas/48/Zazzle/auto_print/openprint/batch_downloaded_PowerBank_104/batch_downloaded_873875-2022-03-15/images_873875-2022-03-15/1898374_M104PD-BLK.tiff',

]


gm()
    .in('-page', `+${x}+${y}`)
    .in(tiffFiles[0])
    .in('-page', `+${twoUpX}+${y}`)
    .in(tiffFiles[1])
    .in('-page', `+${threeUpX}+${y}`)
    .in(tiffFiles[2])
    .in('-page', `+${fourUpX}+${y}`)
    .in(tiffFiles[3])
    .in('-page', `+${fiveUpX}+${y}`)
    .in(tiffFiles[4])
    .in('-page', `+${sixUpX}+${y}`)
    .in(tiffFiles[5])
    .mosaic()
    .write(`test.tiff`, function (err) {
        if (err) console.log(err);
        fs.readFile(`test.tiff`, function (err, file) {
            sharp(file).withMetadata({ density: 300 })
                .ensureAlpha()
                .toColourspace('cmyk')
                .tiff({ compression: 'lzw' })
                .toFile('final.tiff', (err, result) => {
                    if (err) throw err;
                });
        });
    });