const { parseTwoDigitYear } = require("moment")
const { fstat } = require("fs-extra")

let tiffs = [
    '/Volumes/nas/48/Zazzle/auto_print/openprint/batch_downloaded_PowerBank_104/batch_downloaded_869904-2022-03-11/images_869904-2022-03-11/1891020_M104PD-BLK.tiff',
    '/Volumes/nas/48/Zazzle/auto_print/openprint/batch_downloaded_PowerBank_104/batch_downloaded_869904-2022-03-11/images_869904-2022-03-11/1891021_M104PD-BLK.tiff',
    '/Volumes/nas/48/Zazzle/auto_print/openprint/batch_downloaded_PowerBank_104/batch_downloaded_869904-2022-03-11/images_869904-2022-03-11/1891022_M104PD-BLK.tiff',
    '/Volumes/nas/48/Zazzle/auto_print/openprint/batch_downloaded_PowerBank_104/batch_downloaded_869904-2022-03-11/images_869904-2022-03-11/1891024_M104PD-BLK.tiff',
    '/Volumes/nas/48/Zazzle/auto_print/openprint/batch_downloaded_PowerBank_104/batch_downloaded_869904-2022-03-11/images_869904-2022-03-11/1891028_M104PD-BLK.tiff',
    '/Volumes/nas/48/Zazzle/auto_print/openprint/batch_downloaded_PowerBank_104/batch_downloaded_869904-2022-03-11/images_869904-2022-03-11/1891031_M104PD-BLK.tiff'
]

let newArtworksPath = '/Volumes/nas/48/Zazzle/auto_print/openprint/batch_downloaded_PowerBank_104'

let batchBasePath
let newPath = ''
tiffs.forEach(file => {

    let split = file.split('/')
    batchBasePath = file.substring(file.indexOf(split[8]))

    newPath = file.replaceAll('downloaded', 'printed')
    let splitNewPath = newPath.split('/')
    splitNewPath.pop()

    joinedNewPath = splitNewPath.join('/')

    console.log(newPath)
    // if(!fstat.existsSync(joinedNewPath, {recursive:true})){
    //     fs.mkdirSync(joinedNewPath)
    // }

})