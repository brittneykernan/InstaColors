$(function() {

  // would be cool to make this the size of an ig image to repost
  // making this an app 
  // for when summer is near over
  // can choose different sorting
  // option to pick fav summer photos or random
  // android and ios
  // write in swift, do we do this computing on a server or in the app?
  // touch to move pixels around
  
  var imgSrcs = [
    //instagram api image sources 600 x 600 rez
    'img/jacquard.jpg',
    'img/jacquard.jpg',
    'img/jacquard.jpg',
    'img/jacquard.jpg',
    'img/jacquard.jpg',
    'img/bearmnt.jpg'
  ];

  var canvas = canvas = $('<canvas />')[0];
  var allRGBs = [];

  var containerWidth = 300;
  var pixelWidth = 10;
  var pixelsPerRow = containerWidth/pixelWidth;

  scanNextImage();

  function scanNextImage() {
    var img = new Image;
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
      getColors(img);
      if(imgSrcs.length) {
        scanNextImage();
      } else {
        addColorToScreen(allRGBs);
      }
    };
    img.src = imgSrcs.pop();
  }

  function getColors(img) {
    var pixelData, i, j, rgbs = [];
  
    for( i = 0; i < img.width; i+=100) {
      for (j = 0; j < img.height; j+=100) {
        pixelData = canvas.getContext('2d').getImageData(i, j, 1,1).data;   
        rgb = [parseInt(pixelData[0]),parseInt(pixelData[1]),parseInt(pixelData[2])];
        allRGBs.push(rgb);
        //rgbs.push(rgb);
      }
    }
    //addColorToScreen(rgbs);
  }    

  // swap between methods here
  function addColorToScreen(rgbs) {
    //addColorUnsorted(rgbs);
    addColorSorted(rgbs);
  }

  function addColorSorted(rgbs) {
    rgbs.sort(function(a,b) { // sorting by lightness
      var toteA = a[0]+a[1]+a[2];
      var toteB = b[0]+b[1]+b[2];
      return toteA > toteB ? 1 : -1;
    });
    addColorByHue(rgbs);
    //plotInCube(rgbs);
  }

  function addColorUnsorted(rgbs) {
    var container = $('<div/>');
    for(var i = 0; i < rgbs.length; i++) {
      color = $('<span/>').css('background-color','rgb('+rgbs[i][0]+','+rgbs[i][1]+','+rgbs[i][2]+')');
      container.append(color);
    }
    $('body').append(container);
  }

  function addColorByHue(rgbs) {
    var newRgbs = [];

    for(var i = 0; i< rgbs.length/pixelsPerRow; i++) {
      var row = rgbs.slice(i*pixelsPerRow, (i*pixelsPerRow)+ pixelsPerRow);
      row.sort(function(a,b) {
        hueA = rgbaToHSL(a[0],a[1],a[2])[0];
        hueB = rgbaToHSL(b[0],b[1],b[2])[0];
        return hueA > hueB ? 1 : -1;
      });
      newRgbs = newRgbs.concat(row);
    }

    addColorUnsorted(newRgbs);
  }

  function plotInCube(rgbs) {
    var container = $('<div/>').css({
      height: '255px',
      width: '255px'
    });
    for(var i = 0; i < rgbs.length; i++) {
      color = $('<span/>').css({
        'background-color':'rgb('+rgbs[i][0]+','+rgbs[i][1]+','+rgbs[i][2]+')',
        'transform': 'translate3d('+rgbs[i][0]+'px,'+rgbs[i][1]+'px,'+rgbs[i][2]+'px)'
      });
      container.append(color);
    }
    $('body').append(container);
  }
  
  function rgbaToHSL (r, g, b, a) {
    if (a === null || a === undefined) {
        a = 1;
    }

    var hsl = "";
    var normR, normG, normB;
    normR = r / 255;
    normG = g / 255;
    normB = b / 255;
    var max = Math.max(normR, normG, normB), min = Math.min(normR, normG, normB);
    var h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
        case normR:
            h = 60 * (normG - normB) / d;
            break;
        case normG:
            h = 60 * (normB - normR) / d + 120;
            break;
        case normB:
            h = 60 * (normR - normG) / d + 240;
            break;
        }
    }

    h = Math.round(h + 360) % 360;
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return [h,s,l];

    if (a === 1) {
        hsl = "hsl(" + h + ", " + s + "%, " + l + "%)";
    } else {
        hsl = "hsla(" + h + ", " + s + "%, " + l + "%, " + parseFloat(a) + ")";
    }
    return hsl;
}

});