const fs = require('fs'),
  gm = require('gm'),
  sharp = require('sharp'),
  moment = require('moment');
const compositeService = require('./services/composite.services');
const { inherits } = require('util');

let powerbankDirectories = [
  'batch_downloaded_PowerBank_103',
  'batch_downloaded_PowerBank_104'
];

let twoUp = 1966;
let threeUp = 3932;
let fourUp = 5898;
let fiveUp = 7864;
let sixUp = 9830;

let homePath = `${__dirname}`;
let regex = /[.]tiff$/;
fs
  .readdirSync(`${homePath}`)
  .filter((f) => regex.test(f))
  .forEach((f) => fs.unlinkSync(homePath + '/' + f));

let nasPath = '/Volumes/nas/48/Zazzle/auto_print/openprint'; //current path for Mac //change to windows path in production
let today = moment().format('YYYY-MM-DD');

// init();

init = () => {
  powerbankDirectories.forEach((value) => {
    let currReadDirectory;
    currReadDirectory = nasPath + '/' + value;
    fs.readdir(currReadDirectory, { withFileTypes: true }, (err, subdirs) => {
      subdirs.forEach((dir) => {
        let tiffFiles = [];
        let orderDirectory = '';
        let filename = '';
        if (dir.isDirectory() && dir.name.includes(today)) {
          orderDirectory = currReadDirectory + '/' + dir.name;
          let imageDirectory;
          fs.readdir(orderDirectory, { withFileTypes: true }, (err, subdirs1) => {
            subdirs1.forEach((dir1) => {
              let compositeId;

              if (dir1.name.includes('images')) {
                imageDirectory = orderDirectory + '/' + dir1.name;
                compositeId = dir1.name.split('_')[1].split('-')[0];
                fs.readdir(imageDirectory, { withFileTypes: true }, (err, files) => {
                  files.forEach((file) => {
                    let eachFile = imageDirectory + '/' + file.name;
                    tiffFiles.push(eachFile);
                  })
                  Promise.all(tiffFiles).then(() => {
                    let quantity = tiffFiles.length
                    let promises = [];
                    let extension = '.tiff';
                    console.log(tiffFiles)
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
                    Promise.all(promises).then(() => {
                      let filepath = '';
                      filepath = filename + extension;
                      let artworksPath = tiffFiles[0].replace('images', 'artworks');

                      artworksPath = artworksPath.split('/');
                      artworksPath = artworksPath
                        .filter((element, index) => index < artworksPath.length - 1)
                        .join('/');
                      compositeImages(tiffFiles, filepath, artworksPath, compositeId);
                    });

                    compositeImages = (
                      tiffFiles,
                      filepath,
                      artworksPath,
                      compositeId
                    ) => {
                      console.log(filepath)
                      switch (tiffFiles.length) {
                        case 1:
                          gm()
                            .in('-page', '+0+0')
                            .in(tiffFiles[0])
                            .mosaic()
                            .write(`${filepath}`, function (err) {
                              if (err) console.log(err);
                              addColorChannelAndWriteToDisk(
                                filepath,
                                artworksPath,
                                compositeId
                              );
                            });
                          break;
                        case 2:
                          gm()
                            .in('-page', '+0+0')
                            .in(tiffFiles[0])
                            .in('-page', `+${twoUp}`)
                            .in(tiffFiles[1])
                            .mosaic()
                            .write(`${filepath}`, function (err) {
                              if (err) console.log(err);
                              addColorChannelAndWriteToDisk(
                                filepath,
                                artworksPath,
                                compositeId
                              );
                            });
                          break;

                        case 3:
                          gm()
                            .in('-page', '+0+0')
                            .in(tiffFiles[0])
                            .in('-page', `+${twoUp}`)
                            .in(tiffFiles[1])
                            .in('-page', `+${threeUp}`)
                            .in(tiffFiles[2])
                            .mosaic()
                            .write(`${filepath}`, function (err) {
                              if (err) console.log(err);
                              addColorChannelAndWriteToDisk(
                                filepath,
                                artworksPath,
                                compositeId
                              );
                            });
                          break;

                        case 4:
                          gm()
                            .in('-page', '+0+0')
                            .in(tiffFiles[0])
                            .in('-page', `+${twoUp}`)
                            .in(tiffFiles[1])
                            .in('-page', `+${threeUp}`)
                            .in(tiffFiles[2])
                            .in('-page', `+${fourUp}`)
                            .in(tiffFiles[3])
                            .mosaic()
                            .write(`${filepath}`, function (err) {
                              if (err) console.log(err);
                              addColorChannelAndWriteToDisk(
                                filepath,
                                artworksPath,
                                compositeId
                              );
                            });
                          break;

                        case 5:
                          gm()
                            .in('-page', '+0+0')
                            .in(tiffFiles[0])
                            .in('-page', `+${twoUp}`)
                            .in(tiffFiles[1])
                            .in('-page', `+${threeUp}`)
                            .in(tiffFiles[2])
                            .in('-page', `+${fourUp}`)
                            .in(tiffFiles[3])
                            .in('-page', `+${fiveUp}`)
                            .in(tiffFiles[4])
                            .mosaic()
                            .write(`${filepath}`, function (err) {
                              if (err) console.log(err);
                              addColorChannelAndWriteToDisk(
                                filepath,
                                artworksPath,
                                compositeId
                              );
                            });
                          break;

                        case 6:
                          gm()
                            .in('-page', '+0+0')
                            .in(tiffFiles[0])
                            .in('-page', `+${twoUp}`)
                            .in(tiffFiles[1])
                            .in('-page', `+${threeUp}`)
                            .in(tiffFiles[2])
                            .in('-page', `+${fourUp}`)
                            .in(tiffFiles[3])
                            .in('-page', `+${fiveUp}`)
                            .in(tiffFiles[4])
                            .in('-page', `+${sixUp}`)
                            .in(tiffFiles[5])
                            .mosaic()
                            .write(`${filepath}`, function (err) {
                              if (err) console.log(err);
                              addColorChannelAndWriteToDisk(
                                filepath,
                                artworksPath,
                                compositeId
                              );
                            });
                          break;
                      }
                    };
                  });
                });
              }
            });
          });
        }
      });
    });
  });
};

addColorChannelAndWriteToDisk = (filepath, artworksPath, compositeId) => {
  console.log('compositeID: '+ JSON.stringify(compositeId))
  fs.readFile(`${filepath}`, function (err, file) {
    sharp(file)
      .ensureAlpha()
      .toColourspace('cmyk')
      .tiff({ compression: 'lzw' })
      .toFile(`${artworksPath}/${compositeId}_${filepath}`, (err, result) => {
        if (err) throw err;
        compositeService.changeCompositeToDownloaded(compositeId).then((response) => {
          console.log("response: " + JSON.stringify(response));
        });
      });
    //settodownloadedbycomposite ID
  });
};

init()