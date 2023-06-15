 // キャンバス
var src_canvas; 
var src_ctx;
 
// イメージ
var image;
 
// 矩形用
var MIN_WIDTH  = 3;
var MIN_HEIGHT = 3;
 
var rect_MousedownFlg = false;

var rect_num = 0;
var rectObj = [];

window.onload = function () {
  
  src_canvas = document.getElementById("SrcCanvas");
  src_ctx = src_canvas.getContext("2d");    
  
  rectObj.push({
    sx: 0,
    sy: 0,
    ex: 0,
    ey: 0,
    canvas: document.getElementById("RecCanvas_0"),
    ctx: document.getElementById("RecCanvas_0").getContext("2d"),
    lang: 'jpn'
  });

  for (var i=0; i<rectObj.length; i++) {
    rectObj[i].canvas.width = rectObj[i].canvas.height = 1;
  }

  image = document.getElementById("img_source");       

}
 
function OnMousedown(event) {
 
  rect_MousedownFlg = true;
  

  var rect = event.target.getBoundingClientRect();
  rectObj[rect_num].sx = rectObj[rect_num].ex = event.clientX - rect.left;
  rectObj[rect_num].sy = rectObj[rect_num].ey = event.clientY - rect.top; 
    
  // 矩形の枠色を反転させる  
  var imagedata = src_ctx.getImageData(rectObj[rect_num].sx, rectObj[rect_num].sy, 1, 1);
  src_ctx.strokeStyle = "red";

  // 線の太さ
  src_ctx.lineWidth = 3;
    
  // 矩形の枠線を点線にする
  src_ctx.setLineDash([2, 3]);
}
 
function OnMousemove(event) {
  
  if(rect_MousedownFlg){
    
      // 座標を求める
      var rect = event.target.getBoundingClientRect();
      rectObj[rect_num].ex = event.clientX - rect.left;
      rectObj[rect_num].ey = event.clientY - rect.top; 

      // 元画像の再描画
      src_ctx.drawImage(image,0,0);  
      
      // 矩形の描画
      src_ctx.beginPath();

     for(var i=0; i<rectObj.length; i++){
        // 上
        src_ctx.moveTo(rectObj[i].sx,rectObj[i].sy);
        src_ctx.lineTo(rectObj[i].ex,rectObj[i].sy);

        // 下
        src_ctx.moveTo(rectObj[i].sx,rectObj[i].ey);
        src_ctx.lineTo(rectObj[i].ex,rectObj[i].ey);

        // 右
        src_ctx.moveTo(rectObj[i].ex,rectObj[i].sy);
        src_ctx.lineTo(rectObj[i].ex,rectObj[i].ey);

        // 左
        src_ctx.moveTo(rectObj[i].sx,rectObj[i].sy);
        src_ctx.lineTo(rectObj[i].sx,rectObj[i].ey);

        src_ctx.stroke();

      }
  }
}
 
function OnMouseup(event) {

    // キャンバスの範囲外は無効にする    
    if(rectObj[rect_num].sx === rectObj[rect_num].ex && rectObj[rect_num].sy === rectObj[rect_num].ey){
      // 初期化
      src_ctx.drawImage(image,0,0); 
      rectObj[rect_num].sx = rectObj[rect_num].ex = 0;
      rectObj[rect_num].sy = rectObj[rect_num].ey = 0;

      rectObj[rect_num].canvas.width = rectObj[rect_num].canvas.height = 1; 
    }
    
    // 矩形の画像を取得する
    if(rect_MousedownFlg){
      
      // 矩形のサイズ
      rectObj[rect_num].canvas.width  = Math.abs(rectObj[rect_num].sx - rectObj[rect_num].ex);
      rectObj[rect_num].canvas.height = Math.abs(rectObj[rect_num].sy - rectObj[rect_num].ey);
      
    //   // 指定のサイズ以下は無効にする[3x3]
    if(!(rectObj[rect_num].canvas.width >= MIN_WIDTH && rectObj[rect_num].canvas.height >= MIN_HEIGHT)){
        // 初期化
        src_ctx.drawImage(image,0,0); 
        rectObj[rect_num].sx = rectObj[rect_num].ex = 0;
        rectObj[rect_num].sy = rectObj[rect_num].ey = 0; 
        rectObj[rect_num].canvas.width = rectObj[rect_num].canvas.height = 1;
    }else{
        // 矩形用キャンバスへ画像の転送
        rectObj[rect_num].ctx.drawImage(image,
                          Math.min(rectObj[rect_num].sx,rectObj[rect_num].ex),Math.min(rectObj[rect_num].sy,rectObj[rect_num].ey),  
                          Math.max(rectObj[rect_num].sx - rectObj[rect_num].ex,rectObj[rect_num].ex - rectObj[rect_num].sx),Math.max(rectObj[rect_num].sy - rectObj[rect_num].ey ,rectObj[rect_num].ey - rectObj[rect_num].sy),
                          0,0,rectObj[rect_num].canvas.width,rectObj[rect_num].canvas.height);  
      }
    }

  rect_MousedownFlg = false;
}
  
function onDragOver(event){ 
  event.preventDefault(); 
} 
  
function onDrop(event){
  onAddFile(event);
  event.preventDefault(); 
}  
 
// ユーザーによりファイルが追加された  
function onAddFile(event) {
  var files;
  var reader = new FileReader();
  
  if (event.target.files) {
    files = event.target.files;
  } else { 
    files = event.dataTransfer.files;   
  }    

  if ( getExt(files[0].name) === 'pdf' ) {
    reader.onload = function (event) {
      var pdfData = new Uint8Array(event.target.result);
      renderPDF(pdfData, src_canvas);
    };
    reader.readAsArrayBuffer(files[0]);

  } else {
    // ファイルが読み込まれた
    reader.onload = function (event) {
      
      // イメージが読み込まれた
      image.onload = function (){
        src_canvas.width  = image.width;
        src_canvas.height = image.height;
          
        // キャンバスに画像を描画
        src_ctx.drawImage(image,0,0); 
      };      
         
      // イメージが読み込めない
      image.onerror  = function (){
        alert('このファイルは読み込めません。');  
      };
   
      image.src = reader.result;       
    };
    
    if (files[0]){    
      reader.readAsDataURL(files[0]); 
      document.getElementById("inputfile").value = '';
    } 
  }
}


function transcription() {

  for (var i = 0; i<rectObj.length; i++) {
    Ocr(i);
  }
}


function Ocr(i){
  var buf = document.querySelector('#RecCanvas_'+ i);
  Tesseract.recognize(
      buf,
      rectObj[i].lang,
      { 
          logger: function(m) {
              document.querySelector('#progress_'+ i).textContent = m.status;
          }
      }
  )
  .then(function(result){
      document.querySelector('#result_'+ i).textContent = result.data.text.replace(/\s/g, "");
  });
}

function renderPDF(data, canvas) {
  // PDF.jsの読み込み
  pdfjsLib.getDocument(data).promise.then(function(pdf) {
    // 最初のページを取得
    pdf.getPage(1).then(function(page) {
      // ページのサイズを取得
      var viewport = page.getViewport({ scale: 1 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // ページを描画
      var renderContext = {
        canvasContext: src_ctx,
        viewport: viewport
      };
      page.render(renderContext).promise.then(function() {
          // Canvasを画像に変換
          var imageDataURL = canvas.toDataURL('image/png');
          image.src = imageDataURL;
      });
    });
  });
}

//ファイル名から拡張子を取得する関数
function getExt(filename) {
  var pos = filename.lastIndexOf('.');
  if (pos === -1) return '';
  return filename.slice(pos + 1);
}


function addRect(){

  var n = rectObj.length;

  const input = document.createElement("input");
  input.setAttribute("type", "radio");
  input.setAttribute("name", "q1");
  input.setAttribute("value", n);
  const label = document.createElement("label");
  label.innerHTML = " "+ n + " ";
  const div = document.getElementById("radioBtns");
  div.appendChild(input);
  div.appendChild(label);
  var radio_btns = document.querySelectorAll(`input[type='radio'][name='q1']`);
  radio_btns.forEach( (r) => {
    r.addEventListener("change", (e) => {
        rect_num = Number(e.target.value);
    });
  });

  const div_RecCanvases = document.getElementById("RecCanvases");
  const canvas = document.createElement("canvas");
  canvas.setAttribute("id", "RecCanvas_"+ n);
  div_RecCanvases.appendChild(canvas);

  const div2 = document.getElementById("res");
  const select = document.createElement("select");
  select.setAttribute("name", "lang_" + n);
  select.setAttribute("id", "selectLang_" + n);
  const option1 = document.createElement("option");
  option1.setAttribute("value", "jpn");
  option1.textContent = "jpn";
  select.appendChild(option1);
  const option2 = document.createElement("option");
  option2.setAttribute("value", "eng");
  option2.textContent = "eng";
  select.appendChild(option2);
  div2.appendChild(select);

  const p1 = document.createElement("p");
  p1.setAttribute("id", "progress_" + n);
  div2.appendChild(p1);
  const p2 = document.createElement("p");
  p2.setAttribute("id", "result_" + n);
  div2.appendChild(p2);

  document.getElementById('selectLang_'+ n).onchange = function(){
    rectObj[n].lang = this.value;
  };

  rectObj.push({
    sx: 0,
    sy: 0,
    ex: 0,
    ey: 0,
    canvas: document.getElementById("RecCanvas_"+ n),
    ctx: document.getElementById("RecCanvas_"+ n).getContext("2d"),
    lang: 'jpn'
  });
}