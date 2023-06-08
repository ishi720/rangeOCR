 
// キャンバス
var src_canvas; 
var src_ctx;
 
// イメージ
var image;
 
// 矩形用
var MIN_WIDTH  = 3;
var MIN_HEIGHT = 3;
 
var rect_MousedownFlg = false;
var rect_sx = 0;
var rect_sy = 0;
var rect_ex = 0;
var rect_ey = 0;
var lang = 'jpn';


var rect_num = 1;


var rect_sx2 = 0;
var rect_sy2 = 0;
var rect_ex2 = 0;
var rect_ey2 = 0;





 
window.onload = function () {
  
  src_canvas = document.getElementById("SrcCanvas");
  src_ctx = src_canvas.getContext("2d");    
  
  rec_canvas = document.getElementById("RecCanvas");
  rec_ctx = rec_canvas.getContext("2d");
  rec_canvas.width = rec_canvas.height = 1;   
    
  rec_canvas2 = document.getElementById("RecCanvas2");
  rec_ctx2 = rec_canvas2.getContext("2d");
  rec_canvas2.width = rec_canvas2.height = 1;   

  image = document.getElementById("img_source");       

  document.getElementById('selectLang').onchange = function(){
    lang = this.value;
  };

  var radio_btns = document.querySelectorAll(`input[type='radio'][name='q1']`);

  for (var target of radio_btns) {
    target.addEventListener(`change`, () => {
      rect_num = target.value;
    });
  }


}
 
function OnMousedown(event) {
 
  rect_MousedownFlg = true;
  
  if (rect_num===1) {
    // 座標を求める
    var rect = event.target.getBoundingClientRect();
    rect_sx = rect_ex = event.clientX - rect.left;
    rect_sy = rect_ey = event.clientY - rect.top; 
    
    // 矩形の枠色を反転させる  
    var imagedata = src_ctx.getImageData(rect_sx, rect_sy, 1, 1);
    src_ctx.strokeStyle = "red";

    // 線の太さ                         
    src_ctx.lineWidth = 3; 
    
    // 矩形の枠線を点線にする
    src_ctx.setLineDash([2, 3]);                             
  } else {
    // 座標を求める
    var rect = event.target.getBoundingClientRect();
    rect_sx2 = rect_ex2 = event.clientX - rect.left;
    rect_sy2 = rect_ey2 = event.clientY - rect.top; 
    
    // 矩形の枠色を反転させる  
    var imagedata = src_ctx.getImageData(rect_sx2, rect_sy2, 1, 1);
    src_ctx.strokeStyle = "blue";

    // 線の太さ0           
    src_ctx.lineWidth = 3; 
    
    // 矩形の枠線を点線にする
    src_ctx.setLineDash([2, 3]);
  }
}
 
function OnMousemove(event) {
  
  if(rect_MousedownFlg){
    
    if (rect_num === 1) {
      // 座標を求める
      var rect = event.target.getBoundingClientRect();
      rect_ex = event.clientX - rect.left;
      rect_ey = event.clientY - rect.top; 

      // 元画像の再描画
      src_ctx.drawImage(image,0,0);  
      
      // 矩形の描画
      src_ctx.beginPath();

      // 上
      src_ctx.moveTo(rect_sx,rect_sy);
      src_ctx.lineTo(rect_ex,rect_sy);

      // 下
      src_ctx.moveTo(rect_sx,rect_ey);
      src_ctx.lineTo(rect_ex,rect_ey);

      // 右
      src_ctx.moveTo(rect_ex,rect_sy);
      src_ctx.lineTo(rect_ex,rect_ey);

      // 左
      src_ctx.moveTo(rect_sx,rect_sy);
      src_ctx.lineTo(rect_sx,rect_ey);

      src_ctx.stroke();

      // 上
      src_ctx.moveTo(rect_sx2,rect_sy2);
      src_ctx.lineTo(rect_ex2,rect_sy2);

      // 下
      src_ctx.moveTo(rect_sx2,rect_ey2);
      src_ctx.lineTo(rect_ex2,rect_ey2);

      // 右
      src_ctx.moveTo(rect_ex2,rect_sy2);
      src_ctx.lineTo(rect_ex2,rect_ey2);

      // 左
      src_ctx.moveTo(rect_sx2,rect_sy2);
      src_ctx.lineTo(rect_sx2,rect_ey2);

      src_ctx.stroke()
    } else {
      // 座標を求める
      var rect = event.target.getBoundingClientRect();
      rect_ex2 = event.clientX - rect.left;
      rect_ey2 = event.clientY - rect.top; 

      // 元画像の再描画
      src_ctx.drawImage(image,0,0);  
      
      // 矩形の描画
      src_ctx.beginPath();

      // 上
      src_ctx.moveTo(rect_sx,rect_sy);
      src_ctx.lineTo(rect_ex,rect_sy);

      // 下
      src_ctx.moveTo(rect_sx,rect_ey);
      src_ctx.lineTo(rect_ex,rect_ey);

      // 右
      src_ctx.moveTo(rect_ex,rect_sy);
      src_ctx.lineTo(rect_ex,rect_ey);

      // 左
      src_ctx.moveTo(rect_sx,rect_sy);
      src_ctx.lineTo(rect_sx,rect_ey);

      src_ctx.stroke();


      src_ctx.strokeStyle = "blue";
      // 上
      src_ctx.moveTo(rect_sx2,rect_sy2);
      src_ctx.lineTo(rect_ex2,rect_sy2);

      // 下
      src_ctx.moveTo(rect_sx2,rect_ey2);
      src_ctx.lineTo(rect_ex2,rect_ey2);

      // 右
      src_ctx.moveTo(rect_ex2,rect_sy2);
      src_ctx.lineTo(rect_ex2,rect_ey2);

      // 左
      src_ctx.moveTo(rect_sx2,rect_sy2);
      src_ctx.lineTo(rect_sx2,rect_ey2);

      src_ctx.stroke()
    }
  }
}
 
function OnMouseup(event) {
  

  if (rect_num===1) {
    // キャンバスの範囲外は無効にする    
    if(rect_sx === rect_ex && rect_sy === rect_ey){
      // 初期化
      src_ctx.drawImage(image,0,0); 
      rect_sx = rect_ex = 0;
      rect_sy = rect_ey = 0;   
      rec_canvas.width = rec_canvas.height = 1; 
    }
    
    // 矩形の画像を取得する
    if(rect_MousedownFlg){
      
      // 矩形のサイズ
      rec_canvas.width  = Math.abs(rect_sx - rect_ex);
      rec_canvas.height = Math.abs(rect_sy - rect_ey);
      
      // 指定のサイズ以下は無効にする[3x3]
      if(!(rec_canvas.width >= MIN_WIDTH && rec_canvas.height >= MIN_HEIGHT)){
        // 初期化
        src_ctx.drawImage(image,0,0); 
        rect_sx = rect_ex = 0;
        rect_sy = rect_ey = 0; 
        rec_canvas.width = rec_canvas.height = 1;
      }else{
        // 矩形用キャンバスへ画像の転送
        rec_ctx.drawImage(image,
                          Math.min(rect_sx,rect_ex),Math.min(rect_sy,rect_ey),  
                          Math.max(rect_sx - rect_ex,rect_ex - rect_sx),Math.max(rect_sy - rect_ey ,rect_ey - rect_sy),
                          0,0,rec_canvas.width,rec_canvas.height);  
      }
    }
  } else {
    // キャンバスの範囲外は無効にする    
    if(rect_sx2 === rect_ex2 && rect_sy2 === rect_ey2){
      // 初期化
      src_ctx.drawImage(image,0,0); 
      rect_sx2 = rect_ex2 = 0;
      rect_sy2 = rect_ey2 = 0;   
      rec_canvas2.width = rec_canvas2.height = 1; 
    }
    
    // 矩形の画像を取得する
    if(rect_MousedownFlg){
      
      // 矩形のサイズ
      rec_canvas2.width  = Math.abs(rect_sx2 - rect_ex2);
      rec_canvas2.height = Math.abs(rect_sy2 - rect_ey2);
      
      // 指定のサイズ以下は無効にする[3x3]
      if(!(rec_canvas2.width >= MIN_WIDTH && rec_canvas2.height >= MIN_HEIGHT)){
        // 初期化
        src_ctx.drawImage(image,0,0); 
        rect_sx2 = rect_ex2 = 0;
        rect_sy2 = rect_ey2 = 0; 
        rec_canvas2.width = rec_canvas2.height = 1;
      }else{
        // 矩形用キャンバスへ画像の転送
        rec_ctx2.drawImage(image,
                          Math.min(rect_sx2,rect_ex2),Math.min(rect_sy2,rect_ey2),  
                          Math.max(rect_sx2 - rect_ex2,rect_ex2 - rect_sx2),Math.max(rect_sy2 - rect_ey2 ,rect_ey2 - rect_sy2),
                          0,0,rec_canvas2.width,rec_canvas2.height);  
      }
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





function Ocr(){
  var buf = document.querySelector('#RecCanvas');
  Tesseract.recognize(
      buf,
      lang,
      { 
          logger: function(m) {
              document.querySelector('#progress').textContent = m.status;
          }
      }
  )
  .then(function(result){
      document.querySelector('#result').textContent = result.data.text.replace(/\s/g, "");
  });
}