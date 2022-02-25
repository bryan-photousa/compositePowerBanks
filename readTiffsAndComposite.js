const fs = require('fs'),
 gm = require('gm'),
 sharp = require('sharp'),
 moment = require('moment');

const compositeService = require('./services/composite.services');

let powerbankDirectories = [
 'batch_downloaded_PowerBank_103',
 'batch_downloaded_PowerBank_104'
];
let nasPath = '/Volumes/nas/48/Zazzle/auto_print/openprint'; //current path for Mac //change to windows path in production
let today = moment().format('YYYY-MM-DD');
powerbankDirectories.forEach((value) => {
 let tiffFiles = [];
 let currReadDirectory;
 let compositeId;
 currReadDirectory = nasPath + '/' + value;
 fs.readdir(currReadDirectory, { withFileTypes: true }, (err, subdirs) => {
  subdirs.forEach((dir) => {
   if (dir.isDirectory() && dir.name.includes(today)) {
    currReadDirectory = currReadDirectory + '/' + dir.name;

    fs.readdir(currReadDirectory, { withFileTypes: true }, (err, subdirs1) => {
     subdirs1.forEach((dir1) => {
      if (dir1.name.includes('images')) {
       currReadDirectory = currReadDirectory + '/' + dir1.name;
       console.log('currReadDirectory' + JSON.stringify(currReadDirectory));
       compositeId = dir1.name.split('_')[1].split('-')[0];
       console.log('compositeId: ' + JSON.stringify(compositeId));
       fs.readdir(currReadDirectory, { withFileTypes: true }, (err, files) => {
        files.forEach((file) => {
         let eachFile = currReadDirectory + '/' + file.name;
         tiffFiles.push(eachFile);
        });
        Promise.all(tiffFiles).then(() => {
         let filename = '';
         let promises = [];
         let extension = '.tiff';
         tiffFiles.forEach((value, index) => {
          let id = value.split('/')[10].split('_')[0];
          if (index !== tiffFiles.length - 1) {
           filename += id + '-';
          } else {
           filename +=
            id + '_' + value.split('/')[10].split('_')[1].split('.')[0];
          }
          promises.push(index);
         });
         Promise.all(promises).then(() => {
          filename = filename + extension;
          let artworksPath = tiffFiles[0].replace('images', 'artworks');

          artworksPath = artworksPath.split('/');
          artworksPath = artworksPath
           .filter((element, index) => index < artworksPath.length - 1)
           .join('/');
          compositeImages(tiffFiles, filename, artworksPath, compositeId);
         });

         compositeImages = (tiffFiles, filename, artworksPath, compositeId) => {
          switch (tiffFiles.length) {
           case 1:
            gm()
             .in('-page', '+0+0')
             .in(tiffFiles[0])
             .mosaic()
             .write(`${filename}`, function (err) {
              if (err) console.log(err);
              addColorChannel(filename, artworksPath, compositeId);
             });
            break;
           case 2:
            gm()
             .in('-page', '+0+0')
             .in(tiffFiles[0])
             .in('-page', '+1913.5')
             .in(tiffFiles[1])
             .mosaic()
             .write(`${filename}`, function (err) {
              if (err) console.log(err);
              addColorChannelAndWriteToDisk(
               filename,
               artworksPath,
               compositeId
              );
             });
            break;

           case 3:
            gm()
             .in('-page', '+0+0')
             .in(tiffFiles[0])
             .in('-page', '+1913.5')
             .in(tiffFiles[1])
             .in('-page', '+3827')
             .in(tiffFiles[2])
             .mosaic()
             .write(`${filename}`, function (err) {
              if (err) console.log(err);
              addColorChannelAndWriteToDisk(
               filename,
               artworksPath,
               compositeId
              );
             });
            break;

           case 4:
            gm()
             .in('-page', '+0+0')
             .in(tiffFiles[0])
             .in('-page', '+1913.5')
             .in(tiffFiles[1])
             .in('-page', '+3827')
             .in(tiffFiles[2])
             .in('-page', '+5740.5')
             .in(tiffFiles[3])
             .mosaic()
             .write(`${filename}`, function (err) {
              if (err) console.log(err);
              addColorChannelAndWriteToDisk(
               filename,
               artworksPath,
               compositeId
              );
             });
            break;

           case 5:
            gm()
             .in('-page', '+0+0')
             .in(tiffFiles[0])
             .in('-page', '+1913.5')
             .in(tiffFiles[1])
             .in('-page', '+3827')
             .in(tiffFiles[2])
             .in('-page', '+5740.5')
             .in(tiffFiles[3])
             .in('-page', '+7654')
             .in(tiffFiles[4])
             .mosaic()
             .write(`${filename}`, function (err) {
              if (err) console.log(err);
              addColorChannelAndWriteToDisk(
               filename,
               artworksPath,
               compositeId
              );
             });
            break;

           case 6:
            gm()
             .in('-page', '+0+0')
             .in(tiffFiles[0])
             .in('-page', '+1913.5')
             .in(tiffFiles[1])
             .in('-page', '+3827')
             .in(tiffFiles[2])
             .in('-page', '+5740.5')
             .in(tiffFiles[3])
             .in('-page', '+7654')
             .in(tiffFiles[4])
             .in('-page', '+9567')
             .in(tiffFiles[5])
             .mosaic()
             .write(`${filename}`, function (err) {
              if (err) console.log(err);
              addColorChannelAndWriteToDisk(
               filename,
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

addColorChannelAndWriteToDisk = (filename, artworksPath, compositeId) => {
 fs.readFile(`${filename}`, function (err, file) {
  sharp(file)
   .ensureAlpha()
   .toColourspace('cmyk')
   .tiff({ compression: 'lzw' })
   .toFile(
    `${artworksPath}/composite_${compositeId}-${filename}`,
    (err, result) => {
     if (err) throw err;
     console.log('filename saved in nas: ' + JSON.stringify(filename));
     // compositeService.changeCompositeToDownloaded(compositeId).then((response) => {
     //   console.log("response: " + JSON.stringify(response));
     // });
    }
   );
  //settodownloadedbycomposite ID
 });
};
