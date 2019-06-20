import React, {Component} from 'react';
import  { PixelRatio, Dimensions } from 'react-native';

const pixelRatio = PixelRatio.get();
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

function replaceText(text,from,to,closeTag){
    var replacedText = "";

    replacedText = text.replace(new RegExp(from,"g"),to);


    if(closeTag != null && closeTag != "")
    {
        let n = 1;
        replacedText = replacedText.replace(new RegExp(to,"g"), (m, i, og) => {
        return (n++ % 2) ? m : closeTag;
        });
    }
    
    return replacedText;
}

export function ParseText(text){

    if(text == null)
        return text;

    

    var n = 0;
    var parsedText = "";
    var textArray = text.split("\n");
    var bullet = false;

    if(textArray == null)
      return text;

    for (let i = 0; i < textArray.length; i++) {

      var lineText = textArray[i];

      

      //Less Than - 
      // parsedText = parsedText.replace(/</g,"&lt;");

      // H3 Header
      lineText = lineText.replace(/^\#\#\# (.*?)$/gm, (m, i, og) => {
        var h = m.replace(/\#\#\# /,"<h3>");
        h = h + "</h3>";
        return h;
      });

      //H2 Header
      lineText = lineText.replace(/^\#\# (.*?)$/gm, (m, i, og) => {
        var h = m.replace(/\#\# /,"<h2>");
        h = h + "</h2>";
        return h;
      });

      //H1 Header
      lineText = lineText.replace(/^\# (.*?)$/gm, (m, i, og) => {
        var h = m.replace(/\# /,"<h1>");
        h = h + "</h1>";
        return h;
      });

      //Block Quote
      lineText = lineText.replace(/^> (.*?)$/gm, (m, i, og) => {
        var h = m.replace(/> /,"<blockquote><i>&nbsp;&nbsp;&nbsp;&nbsp;");
        h = h + "</i></blockquote>";
        return h;
      });

      lineText = lineText.replace(/^- (.*?)$/gm, (m, i, og) => {
        var h = m.replace(/- /,"&nbsp;&nbsp;&nbsp;&nbsp;• ");
        // h = h + "</li>";
        return h;
      });

      //Horizontal rule
      lineText = lineText.replace(/---/g,"</br><hr></br>");


      // if(lineText.startsWith("<li>") && bullet == false){
      //   lineText = "<ul>" + lineText;
      //   bullet = true;
        
      // }
        
      
      // if(!lineText.startsWith("<li>") && bullet == true){
      //   lineText = "</ul>" + lineText;
      //   bullet = false;
      // }

      if(!lineText.includes("<h1>") && !lineText.includes("<h2>") && !lineText.includes("<h2>") && !lineText.includes("<h3>") && !lineText.includes("<blockquote>") && !lineText.includes("<ul>") && !lineText.includes("<li>"))
        lineText += "</br>";


      parsedText += lineText;
    };

    // if(parsedText.substring(parsedText.length - 5) == "</li>")
    //   parsedText += "</ul>";

    //Link
    parsedText = parsedText.replace(/\[(.*?)\]\((.*?)\)/g, (m, i, og) => {
      var title = m.substring(1,m.indexOf("]"));
      var href = m.substring(m.indexOf("("));

      if(href.contains('"')){
        href = m.substring(1,m.indexOf(")"))
      }
      else{
        href = href.substring(1,href.length - 1);
      }

      var a = '<a href="' + href + '">' + title + '</a>';
      return a;
    });

    //Bold
    parsedText = parsedText.replace(/__/g, (m, i, og) => {
      n += 1;
      if(n % 2 == 0){
        return "</b>";
      }
      else
        return "<b>";
    });

    //Italics
    n = 0;
    parsedText = parsedText.replace(/\*/g, (m, i, og) => {
      n += 1;
      if(n % 2 == 0){
        return "</i>";
      }
      else
        return "<i>";
    });

    //Strike Through
    parsedText = parsedText.replace(/~~/g, (m, i, og) => {
      n += 1;
      if(n % 2 == 0){
        return "</s>";
      }
      else
        return "<s>";
    });

    //Red color highlight
    parsedText = parsedText.replace(/<red>/g, (m, i, og) => {
      n += 1;
      if(n % 2 == 0){
        return "</span>";
      }
      else
        return '<span style="backgroundColor:#FF8080">';
    });

    //Yellow color highlight
    parsedText = parsedText.replace(/<yellow>/g, (m, i, og) => {
      n += 1;
      if(n % 2 == 0){
        return "</span>";
      }
      else
        return '<span style="backgroundColor:#FFFF80">';
    });

    //Green color highlight
    parsedText = parsedText.replace(/<green>/g, (m, i, og) => {
      n += 1;
      if(n % 2 == 0){
        return "</span>";
      }
      else
        return '<span style="backgroundColor:#80FF80">';
    });

    //Blue color highlight
    parsedText = parsedText.replace(/<blue>/g, (m, i, og) => {
      n += 1;
      if(n % 2 == 0){
        return "</span>";
      }
      else
        return '<span style="backgroundColor:#00FFFF">';
    });

    //Red color text
    parsedText = parsedText.replace(/<t-red>/g, (m, i, og) => {
      n += 1;
      if(n % 2 == 0){
        return "</span>";
      }
      else
        return '<span style="color:#FF0000">';
    });

    //Yellow color text
    parsedText = parsedText.replace(/<t-yellow>/g, (m, i, og) => {
      n += 1;
      if(n % 2 == 0){
        return "</span>";
      }
      else
        return '<span style="color:#C0C000">';
    });

    //Green color text
    parsedText = parsedText.replace(/<t-green>/g, (m, i, og) => {
      n += 1;
      if(n % 2 == 0){
        return "</span>";
      }
      else
        return '<span style="color:#008000">';
    });

    //Blue color text
    parsedText = parsedText.replace(/<t-blue>/g, (m, i, og) => {
      n += 1;
      if(n % 2 == 0){
        return "</span>";
      }
      else
        return '<span style="color:#008080">';
    });

    // alert(parsedText);
    return parsedText;





    //Less Than - 
    // parsedText = parsedText.replace(/</g,"&lt;");

    //H3 Header
    // parsedText = parsedText.replace(/^\#\#\# (.*?)$/gm, (m, i, og) => {
    //   var h = m.replace(/\#\#\# /,"<h3>");
    //   h = h.replace(/\n/g,"");
    //   h = h + "</h3>";
    //   return h;
    // });

    // //H2 Header
    // parsedText = parsedText.replace(/^\#\# (.*?)$/gm, (m, i, og) => {
    //   var h = m.replace(/\#\# /,"<h2>");
    //   h = h.replace(/\n/g,"");
    //   h = h + "</h2>";
    //   return h;
    // });

    // //H1 Header
    // parsedText = parsedText.replace(/^\# (.*?)$/gm, (m, i, og) => {
    //   var h = m.replace(/\# /,"<h1>");
    //   h = h.replace(/\n/g,"");
    //   h = h + "</h1>";
    //   return h;
    // });

    // //Block Quote
    // parsedText = parsedText.replace(/^> (.*?)$/gm, (m, i, og) => {
    //   var h = m.replace(/> /,"<blockquote><i>&nbsp;&nbsp;&nbsp;&nbsp;");
    //   h = h.replace(/\n/g,"");
    //   h = h + "</i></blockquote>";
    //   return h;
    // });

    // parsedText = parsedText.replace(/^- (.*?)$/gm, (m, i, og) => {
    //   var h = m.replace(/- /,"<ul><li>");
    //   h = h.replace(/\n/g,"");
    //   h = h + "</li></ul>";
    //   return h;
    // });

    // //Link
    // parsedText = parsedText.replace(/\[(.*?)\]\((.*?)\)/g, (m, i, og) => {
    //   var title = m.substring(1,m.indexOf("]"));
    //   var href = m.substring(m.indexOf("("));

    //   if(href.contains('"')){
    //     href = m.substring(1,m.indexOf(")"))
    //   }
    //   else{
    //     href = href.substring(1,href.length - 1);
    //   }

    //   var a = '<a href="' + href + '">' + title + '</a>';
    //   return a;
    // });

    // //Horizontal rule
    // parsedText = parsedText.replace(/\n---\n/g,"</br><hr></br>");

    // //convert all new lines to br
    // parsedText = parsedText.replace(/\n/g,"</br>");

    // let n = 0;

    // //Bold
    // parsedText = parsedText.replace(/__/g, (m, i, og) => {
    //   n += 1;
    //   if(n % 2 == 0){
    //     return "</b>";
    //   }
    //   else
    //     return "<b>";
    // });

    // //Italics
    // n = 0;
    // parsedText = parsedText.replace(/\*/g, (m, i, og) => {
    //   n += 1;
    //   if(n % 2 == 0){
    //     return "</i>";
    //   }
    //   else
    //     return "<i>";
    // });

    // //Strike Through
    // parsedText = parsedText.replace(/~~/g, (m, i, og) => {
    //   n += 1;
    //   if(n % 2 == 0){
    //     return "</s>";
    //   }
    //   else
    //     return "<s>";
    // });

    // //Red color highlight
    // parsedText = parsedText.replace(/<red>/g, (m, i, og) => {
    //   n += 1;
    //   if(n % 2 == 0){
    //     return "</span>";
    //   }
    //   else
    //     return '<span style="backgroundColor:#FF8080">';
    // });

    // //Yellow color highlight
    // parsedText = parsedText.replace(/<yellow>/g, (m, i, og) => {
    //   n += 1;
    //   if(n % 2 == 0){
    //     return "</span>";
    //   }
    //   else
    //     return '<span style="backgroundColor:#FFFF80">';
    // });

    // //Green color highlight
    // parsedText = parsedText.replace(/<green>/g, (m, i, og) => {
    //   n += 1;
    //   if(n % 2 == 0){
    //     return "</span>";
    //   }
    //   else
    //     return '<span style="backgroundColor:#80FF80">';
    // });

    // //Blue color highlight
    // parsedText = parsedText.replace(/<blue>/g, (m, i, og) => {
    //   n += 1;
    //   if(n % 2 == 0){
    //     return "</span>";
    //   }
    //   else
    //     return '<span style="backgroundColor:#00FFFF">';
    // });

    // //Red color text
    // parsedText = parsedText.replace(/<t-red>/g, (m, i, og) => {
    //   n += 1;
    //   if(n % 2 == 0){
    //     return "</span>";
    //   }
    //   else
    //     return '<span style="color:#FF0000">';
    // });

    // //Yellow color text
    // parsedText = parsedText.replace(/<t-yellow>/g, (m, i, og) => {
    //   n += 1;
    //   if(n % 2 == 0){
    //     return "</span>";
    //   }
    //   else
    //     return '<span style="color:#C0C000">';
    // });

    // //Green color text
    // parsedText = parsedText.replace(/<t-green>/g, (m, i, og) => {
    //   n += 1;
    //   if(n % 2 == 0){
    //     return "</span>";
    //   }
    //   else
    //     return '<span style="color:#008000">';
    // });

    // //Blue color text
    // parsedText = parsedText.replace(/<t-blue>/g, (m, i, og) => {
    //   n += 1;
    //   if(n % 2 == 0){
    //     return "</span>";
    //   }
    //   else
    //     return '<span style="color:#008080">';
    // });

    // alert(parsedText);
    
}

export function GetLanguage(){
    //TODO: Get the current language settings from the DB

    return "en-US";
}

export function GetFontSize(size){

        if (pixelRatio === 2) {
          // iphone 5s and older Androids
          if (deviceWidth < 360) {
            return size * 0.95;
          }
          // iphone 5
          if (deviceHeight < 667) {
            return size;
            // iphone 6-6s
          } else if (deviceHeight >= 667 && deviceHeight <= 735) {
            return size * 1.15;
          }
          // older phablets
          return size * 1.25;
        }
        if (pixelRatio === 3) {
          // catch Android font scaling on small machines
          // where pixel ratio / font scale ratio => 3:3
          if (deviceWidth <= 360) {
            return size;
          }
          // Catch other weird android width sizings
          if (deviceHeight < 667) {
            return size * 1.15;
            // catch in-between size Androids and scale font up
            // a tad but not too much
          }
          if (deviceHeight >= 667 && deviceHeight <= 735) {
            return size * 1.2;
          }
          // catch larger devices
          // ie iphone 6s plus / 7 plus / mi note 等等
          return size * 1.27;
        }
        if (pixelRatio === 3.5) {
          // catch Android font scaling on small machines
          // where pixel ratio / font scale ratio => 3:3
          if (deviceWidth <= 360) {
            return size;
            // Catch other smaller android height sizings
          }
          if (deviceHeight < 667) {
            return size * 1.2;
            // catch in-between size Androids and scale font up
            // a tad but not too much
          }
          if (deviceHeight >= 667 && deviceHeight <= 735) {
            return size * 1.25;
          }
          // catch larger phablet devices
          return size * 1.4;
        }
        // if older device ie pixelRatio !== 2 || 3 || 3.5
        return size;
 
}