const fs = require('fs'),
    gm = require('gm'),
    sharp = require('sharp')



let twoUp = 1974;
let threeUp = twoUp * 2;
let fourUp = twoUp * 3;
let fiveUp = twoUp * 4;
let sixUp = twoUp * 5;
;
let tiffFiles = [
    '/Volumes/nas/48/Zazzle/auto_print/openprint/batch_downloaded_PowerBank_104/batch_downloaded_873875-2022-03-15/images_873875-2022-03-15/1898374_M104PD-BLK.tiff',
    '/Volumes/nas/48/Zazzle/auto_print/openprint/batch_downloaded_PowerBank_104/batch_downloaded_873875-2022-03-15/images_873875-2022-03-15/1898374_M104PD-BLK.tiff',
    '/Volumes/nas/48/Zazzle/auto_print/openprint/batch_downloaded_PowerBank_104/batch_downloaded_873875-2022-03-15/images_873875-2022-03-15/1898374_M104PD-BLK.tiff'
]


gm()
    .in('-page', '+0+0')
    .in(tiffFiles[0])
    .in('-page', `+${twoUp}`)
    .in(tiffFiles[1])
    .in('-page', `+${threeUp}`)
    .in(tiffFiles[2])
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