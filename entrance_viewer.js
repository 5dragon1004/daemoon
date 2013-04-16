window.CAFEAPP_ENTRANCE= { };

function AlphaBackgroundHeightSet(){
    setTimeout(function(){
        try {
            var dimesion = getCoords(daum.$("entrancePanelArea")) //.getDimensions(); // depends on prototypejs
            daum.$("entrance_alpha_bg").style.width = dimesion.width + "px"; 
            daum.$("entrance_alpha_bg").style.height = dimesion.height + "px";
        }  catch (e) { }
    }, 1000);
}

//
// entrance movie viewer script 
//
function EntranceMovieViewerRender() {

    function createPlayerElement(layerId){
        if(daum.$(layerId)){
            return daum.$(layerId);
        }else{
            var layer = document.createElement("DIV");
            layer.id = layerId;
            var parent = daum.$("flvEntrance");
            parent.appendChild(layer);
            return layer;
        } 
    }
    
    function switchEntranceMoviePlayer(moviekey, num){
        var layerId = "flvEntrancePlayer";
        createPlayerElement(layerId);
        daum.$(layerId).innerHTML = '<iframe id="' + moviekey + '" width="402" height="324"' +
          	' src="http://videofarm.daum.net/controller/video/viewer/Video.html?vid=' + moviekey + '&play_loc=daum_cafe" frameborder="0" scrolling="no"></iframe>';
        
        if(typeof(num) != "undefined"){
            var obj = document.getElementById("MovieEntranceArea");
            if(obj){
               obj.className = "movie_entrance movie_selected_" + num;
            }
        }
    }

    function switchEntranceMoviePlayerForPreview(moviekey, num){
        var layerId = "flvEntrancePlayer";
        createPlayerElement(layerId);
		if(CAFEAPP_ENTRANCE.FirstItem){
			daum.$(layerId).innerHTML= '<img src="' + CAFEAPP_ENTRANCE.FirstItem + '.edit" width="402" height="324" alt="" />';
		}
    }
    
	if (CAFEAPP_ENTRANCE.ISPREVIEW){
		window.changeMovie = switchEntranceMoviePlayerForPreview;
	}else{
		window.changeMovie = switchEntranceMoviePlayer;
	}
}

//
// entrance photo viewer script 
//
function EntrancePhotoViewerRender(){
	CAFEAPP_ENTRANCE.photo.photo_entrance_flashvars.cafe_host = getCafeHostForFlash(); //  _intro.html 정의, 임시 땡빵
	if(!CAFEAPP_ENTRANCE["ISPREVIEW"]) {
		CAFEAPP_ENTRANCE.photo.photo_entrance_flashvars.image_list_type = "cached";
	}
	var swf = "http://cafeimg.daum-img.net/cf_img4/mocha/viewer/MochaTemplateLoader.swf?"+ CAFEAPP_ENTRANCE.photo.photo_entrance_flashvars.mocha_viewer_version;
	//var swf = "http://uie.daum.net/cube/mocha/viewer/MochaTemplateLoader.swf?"+ CAFEAPP_ENTRANCE.photo.photo_entrance_flashvars.mocha_viewer_version;
	swfobject.embedSWF(	swf, "photo_entrace_div", "100%", CAFEAPP_ENTRANCE.photo.height, "9.0.45", false, CAFEAPP_ENTRANCE.photo.photo_entrance_flashvars, CAFEAPP_ENTRANCE.photo.photo_entrance_params, {id:"MochaTemplateLoader"});
}
function openPhotoEntranceImagePopup(imageArr, index)
{   
	photo_entrance_array = imageArr;
	photo_entrance_num   = index;

//	var imgPopup = window.open("http://cafe469.daum.net/_c21_/static/photo/viewer.html","photo_entrace_viewer","width=300px, height=300px, toolbar=no, location=no, directories=no, scrollbars=yes, menubar=no, status=no, resizable=yes");

//	var imgPopup = window.open("viewer.html","photo_entrace_viewer","width=300px, height=300px, toolbar=no, location=no, directories=no, scrollbars=yes, menubar=no, status=no, resizable=yes");
}

function getPhotoEntranceBrowserIsIE()
{
	return daum.Browser.ie;
}

function getPhotoEntranceHeight()
{
	return CAFEAPP_ENTRANCE.photo.height;
}

function getPhotoEntrancePreviewData()
{
	return opener.mochaeditor().mocha_preview_data();
}

function getPhotoEntrancePreviewHeight()
{
	return opener.mochaeditor().mocha_preview_height();
}

//
// entrance memo viewer script 
//
function goPaging(type, pagedirect, isInit) {
	if (CAFEAPP_ENTRANCE.totalCnt==0) {
		daum.$('btnPrevMemo').className = "prev_memo_btn_disabled";
		daum.$('btnNextMemo').className = "next_memo_btn_disabled";
		pagedirect = "";
		//if(!isInit) $E('memoRedirectBox').show();
	}
	
	if (pagedirect=="prev") {
		if (CAFEAPP_ENTRANCE.currentPage==1) {
			return;
		} else {
			CAFEAPP_ENTRANCE.currentPage--;
			if(daum.$('memoRedirectBox')) { daum.Element.hide('memoRedirectBox'); }
			daum.$('btnNextMemo').className = "next_memo_btn";
			if (CAFEAPP_ENTRANCE.currentPage==1) { daum.$('btnPrevMemo').className = "prev_memo_btn_disabled"; }
		}
	}
	
	if (pagedirect=="next") {
		if (CAFEAPP_ENTRANCE.currentPage==CAFEAPP_ENTRANCE.lastPage) {
			return;
		} else {
			if(daum.$('memoRedirectBox')) { daum.Element.hide('memoRedirectBox'); }
			if (CAFEAPP_ENTRANCE.currentPage>0) {
				daum.$('btnPrevMemo').className = "prev_memo_btn";
				daum.$('btnNextMemo').className = "next_memo_btn";
			}
			CAFEAPP_ENTRANCE.currentPage++;
			if (CAFEAPP_ENTRANCE.currentPage==CAFEAPP_ENTRANCE.lastPage) {
				daum.$('btnNextMemo').className = "next_memo_btn_disabled";
				// if(CAFEAPP_ENTRANCE.lastPage!=1) if(daum.$('memoRedirectBox')) $E('memoRedirectBox').show();
			}
		}
	}
	
	var startPage = (CAFEAPP_ENTRANCE.currentPage-1) * CAFEAPP_ENTRANCE.pageCnt;
	var endPage = startPage + CAFEAPP_ENTRANCE.pageCnt;
	
	var memoMarkup = "";

	if (type=="post") {
		
		if(CAFEAPP_ENTRANCE.totalCnt <= CAFEAPP_ENTRANCE.pageCnt / 2){
			daum.$("memoPostArea").style.height="148px";	
		}else{
			daum.$("memoPostArea").style.height="265px";	
		}
		
		if (CAFEAPP_ENTRANCE.totalCnt>0) {
			var j=0;
			for (var i = startPage; i<endPage; i++) {
				var jEle= daum.$('post'+ j++);								 
				if (typeof CAFEAPP_ENTRANCE.memoBoardList[i] !="undefined") {
					var nickname= CAFEAPP_ENTRANCE.memoBoardList[i].nickname;
					if(nickname.length>7) nickname= CAFEAPP_ENTRANCE.memoBoardList[i].nickname.substr(0, 7) + "..";
					memoMarkup = '' + 
						'<div class="memo_inner">';
						if(CAFEAPP_ENTRANCE.memoBoardList[i].replycnt == "0"){	
						memoMarkup = memoMarkup +	'<p class="comment"><a href="javascript:view_reply(\''+CAFEAPP_ENTRANCE.memoBoardList[i].dataid+'\',\''+ CAFEAPP_ENTRANCE.memoBoardList[i].fldid+ '\')">'+ CAFEAPP_ENTRANCE.memoBoardList[i].content +'</a></p>';
						} else {
						memoMarkup = memoMarkup +	'<p class="comment"><a href="javascript:view_reply(\''+CAFEAPP_ENTRANCE.memoBoardList[i].dataid+'\',\''+ CAFEAPP_ENTRANCE.memoBoardList[i].fldid+ '\')">'+ CAFEAPP_ENTRANCE.memoBoardList[i].content +'</a> <a href="javascript:view_reply(\''+CAFEAPP_ENTRANCE.memoBoardList[i].dataid+'\',\''+ CAFEAPP_ENTRANCE.memoBoardList[i].fldid+ '\')"><b>['+ CAFEAPP_ENTRANCE.memoBoardList[i].replycnt +']</b></a>' +'</p>';
						}						
						memoMarkup = memoMarkup +	'<dl><dt class="nickname">'+ nickname +'</dt>' +
						'<dd class="picture"><img src="'+ CAFEAPP_ENTRANCE.memoBoardList[i].profileimg +'" width="30" height="30" alt="프로필 사진" /></dd>' +
						'<dd class="date">'+ CAFEAPP_ENTRANCE.memoBoardList[i].date +'</dd></dl>' +
						'</div>';
					jEle.style.display="inline";
					jEle.innerHTML = memoMarkup;
				} else {
					jEle.style.display="none";
					jEle.innerHTML = "";
				}
			}
		} else { // no article
			var memoMsg = (CAFEAPP_ENTRANCE.existMemoBoard) ? "선택된 게시판이 없습니다." : "반가운 인사를 남겨 보세요";
			memoMarkup = '' + 
				'<div class="memo_inner">' +
				'<p class="comment">'+ memoMsg +'</p>' +
				'<dl><dt class="nickname">Daum카페</dt>' +
				'<dd class="picture"><img src="http://i1.daumcdn.net/cafeimg/cf_img4/intro/img_profile.png" width="30" height="30" alt="" /></dd>' +
				'<dd class="date"></dd></dl>' +
				'</div>';
			var jEle= daum.$('post0');
			jEle.style.display="inline";	
			jEle.innerHTML = memoMarkup;
		}
	} else if (type=="list") {
		if (CAFEAPP_ENTRANCE.totalCnt>0) {
			var itemCount= 0;
			for (var i = startPage; i<endPage; i++) {
				if (typeof CAFEAPP_ENTRANCE.memoBoardList[i] !="undefined") {
					memoMarkup = memoMarkup +
						'<dl>' +
						'<dt><b>'+ CAFEAPP_ENTRANCE.memoBoardList[i].nickname.substr(0, 7) +'</b> <span class="vbar">|</span> <span class="date">'+ CAFEAPP_ENTRANCE.memoBoardList[i].date +'</span></dt>' +
						'<dd class="pic"><img src="'+ CAFEAPP_ENTRANCE.memoBoardList[i].profileimg +'" width="35" height="35" alt="프로필 사진" /></dd>';
						
						if(CAFEAPP_ENTRANCE.memoBoardList[i].replycnt == "0"){	
							 memoMarkup = memoMarkup +	'<dd class="comment"><a href="javascript:view_reply(\''+CAFEAPP_ENTRANCE.memoBoardList[i].dataid+'\',\''+ CAFEAPP_ENTRANCE.memoBoardList[i].fldid+ '\')">'+ CAFEAPP_ENTRANCE.memoBoardList[i].content +'</a></dd>';
						} else {
							 memoMarkup = memoMarkup +	'<dd class="comment"><a href="javascript:view_reply(\''+CAFEAPP_ENTRANCE.memoBoardList[i].dataid+'\',\''+ CAFEAPP_ENTRANCE.memoBoardList[i].fldid+ '\')">'+ CAFEAPP_ENTRANCE.memoBoardList[i].content +'</a> <span><a href="javascript:view_reply(\''+CAFEAPP_ENTRANCE.memoBoardList[i].dataid+'\',\''+ CAFEAPP_ENTRANCE.memoBoardList[i].fldid+ '\')"><b>['+ CAFEAPP_ENTRANCE.memoBoardList[i].replycnt +']</b</a></span></dd>';					
						}
												
						 memoMarkup = memoMarkup + '</dl>';
					if ((i+1)%2 == 0 || CAFEAPP_ENTRANCE.layout==3) memoMarkup = memoMarkup + '<div class="line"></div>';
					itemCount++;
				}
			}
			if((itemCount)%2!=0 && CAFEAPP_ENTRANCE.layout!=3) memoMarkup = memoMarkup + '<div class="line"></div>';
			
			daum.$('memoListArea').innerHTML = memoMarkup.split("&quot;").join("\"");
		} else { // no article
			var memoMsg = (CAFEAPP_ENTRANCE.existMemoBoard) ? "선택된 게시판이 없습니다." : "반가운 인사를 남겨 보세요";
			memoMarkup = memoMarkup +
				'<dl>' +
				'<dt><b>Daum카페</b></dt>' +
				'<dd class="pic"><img src="http://i1.daumcdn.net/cafeimg/cf_img4/intro/img_profile.png" width="35" height="35" alt="" /></dd>' +
				'<dd class="comment">'+ memoMsg +'</dd>' +
				'</dl>';
			memoMarkup = memoMarkup + '<div class="line"></div>';
			daum.$('memoListArea').innerHTML = memoMarkup.split("&quot;").join("\"");
		}
	}
}

function showMessageBox() {
	daum.Element.show('memoViewDarkLayer');
	daum.Element.show('memoViewMessageBox');
	
	var entrance_width = daum.$('entrancePanelArea').offsetWidth;
	var entrance_height = daum.$('entrancePanelArea').offsetHeight;
	var msgbox_width = daum.$('memoViewMessageBox').offsetWidth;
	var msgbox_height = daum.$('memoViewMessageBox').offsetHeight;

	var top =  (entrance_height / 2) - (msgbox_height / 2) - 25; // padding top 
	var left = (entrance_width / 2) - (msgbox_width / 2) - 25; // padding left
	
	daum.$('memoViewDarkLayer').style.width = entrance_width +"px";
	daum.$('memoViewDarkLayer').style.height = entrance_height +"px";
	daum.$('memoViewMessageBox').style.top = top +"px";
	daum.$('memoViewMessageBox').style.left = left +"px";
}
