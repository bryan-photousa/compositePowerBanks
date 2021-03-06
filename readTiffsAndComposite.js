const fs = require('fs'),
  gm = require('gm'),
  sharp = require('sharp'),
  moment = require('moment');
const compositeService = require('./services/composite.services');
const fsExtra = require('fs-extra')
const logger = require('./utilities/logger');
const cron = require('node-cron');



let powerbankDirectories = [
  'batch_downloaded_PowerBank_103',
  'batch_downloaded_PowerBank_104'
];


let y = 0
let x = 0

let twoUpX = 1966;
let threeUpX = 3932;
let fourUpX = 5898;
let fiveUpX = 7864;
let sixUpX = 9830;




init = (system) => {
  if(!system){
    logger.warn("ERROR: NO SYSTEM SPECIFIED!")
    return false
  }
  let nasPath = `/Volumes/nas/48/Zazzle/auto_print/${system}`; //current path for Mac //change to windows path in production

  cleanUp()
  let today = moment().format('YYYY-MM-DD');

  logger.info(":::READ TIFFS AND COMPOSITE INITIALIZED:::")
  powerbankDirectories.forEach((value) => {
    let currReadDirectory;
    currReadDirectory = nasPath + '/' + value;
    fs.readdir(currReadDirectory, { withFileTypes: true }, (err, subdirs) => {
      console.log({ subdirs })
      if (!subdirs) {
        logger.info("NO POWERBANK DIRECTORIES FOUND IN " + JSON.stringify(currReadDirectory))
      } else {
        subdirs.forEach((dir) => {
          logger.info('LINE 49: SEARCHING FOR ' + JSON.stringify(value.split("_")[3]) + " IN " + JSON.stringify(dir.name))
          let tiffFiles = [];
          let orderDirectory = '';
          let filename = '';
          if (dir.isDirectory() && dir.name.includes(today)) {
            orderDirectory = currReadDirectory + '/' + dir.name;
            let imageDirectory;
            fs.readdir(orderDirectory, { withFileTypes: true }, (err, subdirs1) => {
              let opOrderIds = ''
              let artworksPath = ''
              subdirs1.forEach((dir1) => {
                logger.info('LINE 60: SEARCHING FOR ' + JSON.stringify(value.split("_")[3]) + " IN " + JSON.stringify(dir1.name))
                let compositeId;
                if (dir1.name.includes("artworks")) {
                  opOrderIds = dir1.name.split("_")[1]
                  artworksPath = orderDirectory + "/" + dir1.name
                  logger.info('LINE 67: SEARCHING FOR ' + artworksPath)
                }
                if (dir1.name.includes('images')) {
                  imageDirectory = orderDirectory + '/' + dir1.name;

                  compositeId = dir1.name.split('_')[1].split('-')[0];
                  fs.readdir(imageDirectory, { withFileTypes: true }, (err, files) => {
                    files.forEach((file) => {
                      let eachFile = imageDirectory + '/' + file.name;
                      tiffFiles.push(eachFile);
                    })
                    logger.info('LINE 78: HOW MANY TIFFS: ' + tiffFiles.length)
                    Promise.all(tiffFiles).then(() => {
                      let quantity = tiffFiles.length
                      let promises = [];
                      let extension = '.tiff';
                      if (tiffFiles.length > 0) {
                        tiffFiles.forEach((value, index) => {
                          let id = value.split('/')[10].split('_')[0];
                          if (index !== tiffFiles.length - 1) {
                            filename += id + '_';
                          } else {
                            filename +=
                              id + '_' + value.split('/')[10].split('_')[1].split('.')[0] + "_" + quantity;
                          }
                          promises.push(index);
                        });
                      }
                      Promise.all(promises).then(() => {
                        let filepath = '';
                        filepath = filename + extension;
                        if (tiffFiles.length > 0) {
                          logger.info('LINE 99: About to Composite ' + filepath);
                          compositeImages(tiffFiles, filepath, artworksPath, compositeId, opOrderIds);
                        }
                      }).catch(err => {
                        if (err) {
                          logger.info(err)

                        }
                      });

                      compositeImages = (
                        tiffFiles,
                        filepath,
                        artworksPath,
                        compositeId,
                        opOrderIds

                      ) => {
                        logger.info("INITIALIZING COMPOSITE FOR " + JSON.stringify(tiffFiles.length) + " TIFF FILES.")
                        switch (tiffFiles.length) {
                          case 1:
                            gm()
                              .in('-page', `+${x}+${y}`)
                              .in(tiffFiles[0])
                              .mosaic()
                              .write(`${filepath}`, function (err) {
                                if (err) {
                                  logger.warn("ERROR WRITING COMPOSITE TIFF " + JSON.stringify(filepath))
                                }
                                logger.info('COMPOSITING COMPLETED.')
                                addColorChannelAndWriteToDisk(
                                  filepath,
                                  artworksPath,
                                  compositeId,
                                  tiffFiles,
                                  opOrderIds
                                );
                              });
                            break;
                          case 2:
                            gm()
                              .in('-page', `+${x}+${y}`)
                              .in(tiffFiles[0])
                              .in('-page', `+${twoUpX}+${y}`)
                              .in(tiffFiles[1])
                              .mosaic()
                              .write(`${filepath}`, function (err) {
                                if (err) {
                                  logger.warn("ERROR WRITING COMPOSITE TIFF " + JSON.stringify(filepath))
                                }
                                logger.info('COMPOSITING COMPLETED.')
                                addColorChannelAndWriteToDisk(
                                  filepath,
                                  artworksPath,
                                  compositeId,
                                  tiffFiles,
                                  opOrderIds

                                );
                              });
                            break;

                          case 3:
                            gm()
                              .in('-page', `+${x}+${y}`)
                              .in(tiffFiles[0])
                              .in('-page', `+${twoUpX}+${y}`)
                              .in(tiffFiles[1])
                              .in('-page', `+${threeUpX}+${y}`)
                              .in(tiffFiles[2])
                              .mosaic()
                              .write(`${filepath}`, function (err) {
                                if (err) {
                                  logger.warn("ERROR WRITING COMPOSITE TIFF " + JSON.stringify(filepath))
                                }
                                logger.info('COMPOSITING COMPLETED.')

                                addColorChannelAndWriteToDisk(
                                  filepath,
                                  artworksPath,
                                  compositeId,
                                  tiffFiles,
                                  opOrderIds
                                );
                              });
                            break;

                          case 4:
                            gm()
                              .in('-page', `+${x}+${y}`)
                              .in(tiffFiles[0])
                              .in('-page', `+${twoUpX}+${y}`)
                              .in(tiffFiles[1])
                              .in('-page', `+${threeUpX}+${y}`)
                              .in(tiffFiles[2])
                              .in('-page', `+${fourUpX}+${y}`)
                              .in(tiffFiles[3])
                              .mosaic()
                              .write(`${filepath}`, function (err) {
                                if (err) {
                                  logger.warn("ERROR WRITING COMPOSITE TIFF " + JSON.stringify(filepath))
                                }
                                logger.info('COMPOSITING COMPLETED.')
                                addColorChannelAndWriteToDisk(
                                  filepath,
                                  artworksPath,
                                  compositeId,
                                  tiffFiles,
                                  opOrderIds
                                );
                              });
                            break;
                          case 5:
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
                              .mosaic()
                              .write(`${filepath}`, function (err) {
                                if (err) {
                                  logger.warn("ERROR WRITING COMPOSITE TIFF " + JSON.stringify(filepath))
                                }
                                logger.info('COMPOSITING COMPLETED.')
                                addColorChannelAndWriteToDisk(
                                  filepath,
                                  artworksPath,
                                  compositeId,
                                  tiffFiles,
                                  opOrderIds
                                );
                              });
                            break;

                          case 6:
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
                              .write(`${filepath}`, function (err) {
                                logger.info('COMPOSITING COMPLETED.')
                                if (err) {
                                  logger.warn("ERROR WRITING COMPOSITE TIFF " + JSON.stringify(filepath))
                                }
                                addColorChannelAndWriteToDisk(
                                  filepath,
                                  artworksPath,
                                  compositeId,
                                  tiffFiles,
                                  opOrderIds
                                );
                              });
                            break;
                        }
                      };
                    }).catch(err => {
                      if (err) {
                        logger.warn("ERROR AFTER TRAVERSING DIRECTORIES::: " + JSON.stringify(err))
                      }
                    });
                  });
                }
              });
            });
          }

        });
      }
    });
  });

};

addColorChannelAndWriteToDisk = (filepath, artworksPath, compositeId, tiffFiles, opOrderIds) => {
  logger.info("ADDING CMYK CHANNEL TO COMPOSITE")
  fs.readFile(`${filepath}`, function (err, file) {
    sharp(file).withMetadata({ density: 300 })
      .ensureAlpha()
      .toColourspace('cmyk')
      .tiff({ compression: 'lzw' })
      .toFile(`${artworksPath}/${opOrderIds}_${compositeId}_${filepath}`, (err, result) => {
        logger.info("CMYK CHANNEL ADDED TO COMPOSITE @ 300 DPI " + `${artworksPath}/${compositeId}_${filepath}`)
        if (err) throw err;
        let newPath = ''

        tiffFiles.forEach(file => {
          let find = "downloaded"
          let re = new RegExp(find, 'g')
          newPath = file.replace(re, 'printed')
          let splitNewPath = newPath.split('/')
          splitNewPath.pop()

          let joinedNewPath = splitNewPath.join('/')
          if (!fs.existsSync(joinedNewPath)) {
            fs.mkdirSync(joinedNewPath, { recursive: true })
          }
          fsExtra.move(file, newPath, (err) => {
            if (err) {
              throw err
            }
            logger.info(`${file} moved to ${newPath}`)
          })
        })
        // compositeService.changeCompositeToDownloaded(compositeId, system).then((response) => {
        //   if (response) {
        //     logger.info("COMPOSITE ID: " + JSON.stringify(compositeId) + ": RESPONSE FROM OP " + { response })

        //   }
        // });
      })
  });
};

cleanUp = () => {
  let homePath = `${__dirname}`;
  let regex = /[.]tiff$/;
  fs
    .readdirSync(`${homePath}`)
    .filter((f) => regex.test(f))
    .forEach((f) => fs.unlinkSync(homePath + '/' + f));
}


init('iprint')
// init('openprint')

// cron.schedule('40 7 * * *', function () {
//   logger.info('Openprint CRONJOB INITIALIZED')
//   init('openprint')
// })

cron.schedule('40 7 * * *', function () {
  logger.info('iPrint CRONJOB INITIALIZED')
  init('iprint')
})

