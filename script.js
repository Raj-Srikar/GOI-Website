var notReverse = true, isHalloween = true, creatorSelected = false, typeSelected = false, getAlphaMain = true;
mainTag = document.getElementsByTagName('main')[0];

function embed(link) {
	link = String(link)
	if (link.includes('?t'))
		link = link.replace('?t', '?start');
	embeded = link.replace('watch?v=','embed/');
	if (link == embeded)
		embeded = link.replace('youtu.be', 'youtube.com/embed');
	return embeded;
}

creators = new Set();
lengths = new Set();
categories = new Set();
dimensions = new Set();

function fetchJSON() {
	fetch('https://opensheet.elk.sh/11bmvaGVkJtoERDa9Caobigt3s7EsLEpEFqaVB2Gb2Xk/map_data')
	.then(response=>response.json())
	.then(data=>{
			for (var i = 0; i < data.length; i++) {
				newArticle = document.createElement('article');
				divTag = document.createElement('div');
				data[i]["Video"] ? ifrTag = document.createElement('iframe'):imgTag = document.createElement('img');
				h2Tag = document.createElement('h2');
				anchTag = document.createElement('a');
				paraTag = document.createElement('p');
				boldTag1 = document.createElement('b');
				spanTag1 = document.createElement('span');
				brTag = document.createElement('br');
				boldTag2 = document.createElement('b');
				spanTag2 = document.createElement('span');
				data[i]["Video"] ? ifrTag.setAttribute('src',embed(data[i]["Video"])) : imgTag.setAttribute('src',"images/noVideo.png");
				ifrTag.setAttribute('srcdoc','<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href='+ifrTag.src+'><img src=https://img.youtube.com/vi/'+ifrTag.src.substr(ifrTag.src.indexOf('embed/')+6,11)+'/hqdefault.jpg><span>▶</span></a>')
				ifrTag.setAttribute('loading','lazy');
				ifrTag.setAttribute('allowfullscreen','');
				data[i]["Video"] ? divTag.appendChild(ifrTag) : divTag.appendChild(imgTag);
				h2Tag.setAttribute('title','Download '+data[i]["Map Name"]);
				anchTag.setAttribute('href',data[i]["Download"]);
				anchTag.setAttribute('target','_blank');
				anchTag.innerHTML=data[i]["Map Name"];
				h2Tag.appendChild(anchTag);
				boldTag1.innerHTML='Creator:';
				spanTag1.innerHTML=data[i]["Author"];
				boldTag2.innerHTML='Map Type:';
				mapType = data[i]["Length"] + ' ' + data[i]["Category / Type / Style"] + ' ' + data[i]["3D / 2.5D / 2D"];
				spanTag2.innerHTML = mapType.trim().length !== 0 ? mapType : 'Not Specified';
				paraTag.appendChild(boldTag1);
				paraTag.appendChild(spanTag1);
				paraTag.appendChild(brTag);
				paraTag.appendChild(boldTag2);
				paraTag.appendChild(spanTag2);
				newArticle.appendChild(divTag);
				newArticle.appendChild(h2Tag);
				if (data[i]['Category / Type / Style'].includes('Halloween')) {
					newArticle.className = 'halloween-map';
					newArticle.title = 'Halloween Map'
					img1 = document.createElement('img');
					img1.src="images/halloween/moonbats.png";
					img1.className = "moonbats";
					newArticle.appendChild(img1);
				}
				newArticle.appendChild(paraTag);
				if (data[i]['Category / Type / Style'].includes('Halloween')) {
					img2 = document.createElement('img');
					img2.src="images/halloween/jacko.png";
					img2.className = "jacko";
					newArticle.appendChild(img2);
				}
				mainTag.appendChild(newArticle);
				creators.add(data[i]["Author"]);
				lengths.add(data[i]["Length"]);
				categories.add(data[i]["Category / Type / Style"]);
				dimensions.add(data[i]["3D / 2.5D / 2D"]);
			}
			creators = [...creators].sort().filter(ele => {return ele.length!=0});
			lengths = [...lengths].sort().filter(ele => {return ele.length!=0});
			cates = [...categories].filter(ele => {return ele.length!=0});
			categories.clear();
			for(i=0; i<cates.length; i++){
			    if(cates[i].includes(',')){
			        deli = cates[i].split(', ')
			        for(j=0; j<deli.length; j++)
			            categories.add(deli[j])
			    }
			    else
			        categories.add(cates[i])
			}
			cates_sorted = [...categories].sort().filter(ele => {return !ele.startsWith('(')});
			categories = uniqueValuesIgnoreCase(cates_sorted);
			categories.splice(categories.indexOf('Halloween'), 1);
			dimensions = [...dimensions].sort().filter(ele => {return ele.length!=0});
		}
	)
}

function uniqueValuesIgnoreCase(arr) {
	arr_lc = [...(new Set(arr.map(ele => {return ele.toLowerCase()})))];
	set = new Set();
	for (var i = 0; i < arr_lc.length; i++) {
		for (var j = 0; j < arr.length; j++) {
			if (arr_lc[i]==arr[j].toLowerCase()) {
				set.add(arr[j]);
				break;
			}
		}
	}
	return [...set]
}

function alphaSort() {
	let oldMain = document.getElementsByTagName('main')[0];
	mapNames = [];
	anchs = oldMain.getElementsByTagName('a');
	sort_btn = document.getElementById('alphaSort')

	for(i=0;i<anchs.length;i++){
	    mapNames[i]=anchs[i].innerText.trim().toLowerCase()
	}

	mapNames.sort();
	
	if (notReverse) {
		sort_btn.innerHTML = '<i class="fas fa-sort-alpha-down"></i>';
		notReverse = false;
	}
	else{
		sort_btn.innerHTML = '<i class="fas fa-sort-alpha-down-alt"></i>';
		mapNames.reverse();
		notReverse = true;
	}

	let histo = {}
	let skipIters = 0
	let newMain = document.createElement('main');
	for(i=0;i<anchs.length;i++){
		if (mapNames[i] in histo) {
			histo[mapNames[i]]++;
		}
		else{
			histo[mapNames[i]] = 1;
		}
		skipIters = histo[mapNames[i]];
	    for(j=0;j<anchs.length;j++){
		    anch = anchs[j]
		    thisMap = anch.innerText.trim();
		    article = anch.parentNode.parentNode.cloneNode(true);
	        if(mapNames[i]==thisMap.toLowerCase()){
	        	if (skipIters>1) {
	        		skipIters--;
	        		continue;
	        	}
		        newMain.appendChild(article);
	            break;
	        }
	    }
	}
	if (getAlphaMain) {mainTag = newMain.cloneNode(true);getAlphaMain=false;}
	mainDiv = oldMain.parentNode;
	oldMain.remove();
	mainDiv.appendChild(newMain)
}

function apply_halloween_theme(bodyTag, headerTag, tagLine, halloweenButton, navATags) {
	bodyTag.style = "background-image: linear-gradient(#00000033, #00000033), url(https://www.wallpapertip.com/wmimgs/67-676387_halloween-wallpapers-hd-3-halloween-night-wallpaper-hd.jpg);";
	headerTag.style = "background-image: linear-gradient(to left, #00000055, #00000055), url(https://cdn.wallpapersafari.com/49/15/H0xLQG.jpg);background-position-y: 90%;box-shadow: 0px 5px 20px 5px rgb(255 94 0 / 30%);";
	tagLine = "color: #e2ddd5;";
	halloweenButton.style = "color:red;background-color: black;border: 2px solid red;box-shadow: 0px 0px 10px 5px #b94646;";
	halloweenButton.onmouseenter = function(){halloweenButton.style.color='#ffe002';halloweenButton.style.boxShadow='orangered 0px 0px 10px 5px'};
	halloweenButton.onmouseleave = function(){halloweenButton.style.color='red';halloweenButton.style.boxShadow='#b94646 0px 0px 10px 5px'};
	for (var i = 0; i < navATags.length; i++) {
		navATags[i].className = "scythes"
	}
	document.getElementById('filterBy').style = 'display:none';
	let alphaSortTag = document.getElementById('alphaSort');
	alphaSortTag.style = 'box-shadow: rgb(146 185 70) 0px 0px 10px 2px;color: limegreen;border: 1px solid limegreen; background-color:black';
	alphaSortTag.onmouseenter = function(){this.style.boxShadow = '#fbff00 0px 0px 10px 2px';this.style.color = '#ccff00';this.style.border = '1px solid yellowgreen';};
	alphaSortTag.onmouseleave = function(){this.style.boxShadow = 'rgb(146 185 70) 0px 0px 10px 2px';this.style.color = 'limegreen';this.style.border = '1px solid limegreen';};
}

function remove_halloween_theme(bodyTag, headerTag, tagLine, halloweenButton, navATags) {
	bodyTag.style = "";
	headerTag.style = "";
	tagLine = "";
	halloweenButton.style = "";
	halloweenButton.onmouseenter = function(){};
	halloweenButton.onmouseleave = function(){};
	for (var i = 0; i < navATags.length; i++) {
		navATags[i].className = "";
	}
	document.getElementById('filterBy').style = '';
	let alphaSortTag = document.getElementById('alphaSort');
	alphaSortTag.style = '';
	alphaSortTag.onmouseenter = function(){};
	alphaSortTag.onmouseleave = function(){};
}

function animate_spider_downward() {
	spider = document.getElementById('spider');
	spider.style.top = '52%';
	webthread = document.getElementById('webthread');
	webthread.style.height = '53%'
}

function animate_spider_upward() {
	spider = document.getElementById('spider');
	spider.style.top = '12%';
	webthread = document.getElementById('webthread');
	webthread.style.height = '13%'
}

deselect_filter_halloween = true;
function halloweenSort() {
	if (!deselect_filter_halloween) {
		deselect_content_filter();
	}
	let bodyTag = document.getElementsByTagName('body')[0];
	let headerTag = document.getElementsByTagName('header')[0];
	let tagLine = headerTag.getElementsByTagName('p')[0];
	let halloweenButton = document.getElementById('halloweenSort');
	let navATags = headerTag.getElementsByTagName('a');

	let oldMain = document.getElementsByTagName('main')[0];
	halloweenMaps = oldMain.getElementsByClassName('halloween-map');
	let newMain = document.createElement('main');

	if (isHalloween) {
		apply_halloween_theme(bodyTag, headerTag, tagLine, halloweenButton, navATags);
		for (var i = 0; i < halloweenMaps.length; i++) {
			newMain.appendChild(halloweenMaps[i].cloneNode(true));
		}
		isHalloween = false;

		spiderWebDiv = document.createElement('div');
		spiderWebDiv.innerHTML = '<img src="images/halloween/web-top-left.png" style="top:0;left:0"><img src="images/halloween/web-bottom-left.png" style="bottom:0;left:0"><img src="images/halloween/web-bottom-right.png" style="bottom:0;right:0"><img id="toprightweb" src="images/halloween/top-right-web.png" style="top:0;right:0;"><img src="images/halloween/spida.png" id="spider"><span id="webthread"></span>';
		spiderWebDiv.setAttribute('id', 'spiderWebDiv');
		document.getElementsByTagName('body')[0].appendChild(spiderWebDiv);
		spiderAbove = true;
		spiderInterval = setInterval(function() {
				if (spiderAbove){
					animate_spider_downward();
					spiderAbove = false;
				}
				else{
					animate_spider_upward();
					spiderAbove = true;
				}
			}, 10000);
	}
	else{
		remove_halloween_theme(bodyTag, headerTag, tagLine, halloweenButton, navATags);
		newMain = mainTag;
		isHalloween = true;
		clearInterval(spiderInterval);
		document.getElementById('spiderWebDiv').remove();
		notReverse = false;
		document.getElementById('alphaSort').innerHTML = '<i class="fas fa-sort-alpha-down"></i>';
	}


	oldMain.remove();
	mainDiv.appendChild(newMain)
}

spans = mainTag.getElementsByTagName('span');

creators_lc = [];
lengths_lc = [];
categories_lc = [];
dimensions_lc = [];
function content_list() {
	for (var i = 0; i < creators.length; i++) {
		creators_lc[i] = creators[i].toLowerCase();
	}
	creators_lc.sort();

	for (var i = 0; i < lengths.length; i++) {
		lengths_lc[i] = lengths[i].toLowerCase();
	}
	lengths_lc.sort();

	for (var i = 0; i < categories.length; i++) {
		categories_lc[i] = categories[i].toLowerCase();
	}
	categories_lc.sort();

	for (var i = 0; i < dimensions.length; i++) {
		dimensions_lc[i] = dimensions[i].toLowerCase();
	}
	dimensions_lc.sort();
}

function add_subMenu_content(content, lc, index) {
	let subMenu = document.getElementsByClassName('sub-menu')[index];
	for (i = 0; i < lc.length; i++) {
		let subDiv = document.createElement('div');
		subDiv.onclick = function(){filter_by_content(this, index)}
		for (var j = 0; j < content.length; j++) {
			if (lc[i]==content[j].toLowerCase()){
				subDiv.innerHTML = content[j];
				break;
			}
		}
		subMenu.appendChild(subDiv);
	}
}


var previous_creator='', previous_type='', creatorSub = false, typeSub = false;
function filter_by_content(content_tag, index) {
	sort_btn.innerHTML = '<i class="fas fa-sort-alpha-down"></i>';
	notReverse = false;
	let subs = document.getElementsByClassName('sub');
	for (var i = 0; i < subs.length; i++) {
		subs[i].style.backgroundColor='';
		subs[i].onmouseenter = function(){scrollBack(this)};
		subs[i].onmouseleave = function(){};
	}
	if (previous_creator!='') {
		previous_creator.style.backgroundColor='';
		previous_creator.onmouseenter = function(){};
		previous_creator.onmouseleave = function(){};
	}
	if (previous_type!='') {
		previous_type.style.backgroundColor='';
		previous_type.onmouseenter = function(){};
		previous_type.onmouseleave = function(){};
	}
	content = content_tag.innerText;
	creatorSub = content_tag.parentNode.parentNode;
	typeSub = content_tag.parentNode.parentNode;
	if (index==0){
		creatorSub.style.backgroundColor = '#b4ffc7';
		creatorSub.onmouseenter = function (){this.style.backgroundColor = '#91eaa8';scrollBack(this)};
		creatorSub.onmouseleave = function (){this.style.backgroundColor = '#b4ffc7';};
	}
	else if (index>0) {
		typeSub.style.backgroundColor = '#b4ffc7';
		typeSub.onmouseenter = function (){this.style.backgroundColor = '#91eaa8';scrollBack(this)};
		typeSub.onmouseleave = function (){this.style.backgroundColor = '#b4ffc7';};
	}
	content_tag.style.backgroundColor = '#b4ffc7';
	content_tag.onmouseenter =  function () {this.style.backgroundColor = '#91eaa8';}
	content_tag.onmouseleave = function(){this.style.backgroundColor = '#b4ffc7';}
	content_tag.parentNode.style.display = 'none';
	articles = mainTag.getElementsByTagName('article');
	newMainTag = mainTag;		// for getting the original main tag without any sorts or filters
	thisMain = document.getElementsByTagName('main')[0];
	thisMain.remove();
	mainDiv.appendChild(newMainTag);
	thisMain = document.getElementsByTagName('main')[0];
	mainByContent = document.createElement('main');
	for(i=0;i<articles.length;i++){
		if (index>0) {
			checkName = articles[i].getElementsByTagName('span')[1].innerText;
		    if(checkName.toLowerCase().includes(content.toLowerCase()))
		        mainByContent.appendChild(articles[i].cloneNode(true));
		}
		else{
		    checkName = articles[i].getElementsByTagName('span')[index].innerText;
		    if(checkName==content)    
		        mainByContent.appendChild(articles[i].cloneNode(true));
	    }
	}
	thisMain.remove();
	mainDiv.appendChild(mainByContent);
	if (index==0) {
		creatorSelected = true;
		previous_creator = content_tag;
	}
	else if (index>0) {
		typeSelected = true;
		previous_type = content_tag;
	}
	deselect_filter_halloween = false;
}

function deselect_content_filter() {
	if (creatorSelected) {
		let original_main = mainTag.cloneNode(true);
		let thisMain = document.getElementsByTagName('main')[0];
		thisMain.remove();
		mainDiv.appendChild(original_main);
		sort_btn.innerHTML = '<i class="fas fa-sort-alpha-down"></i>';
		if (previous_creator!='') {
			previous_creator.style.backgroundColor='';
			previous_creator.onmouseenter = function(){};
			previous_creator.onmouseleave = function(){};
		}
		creatorSub.onmouseenter = function (){scrollBack(this)};
		creatorSub.onmouseleave = function (){};
		creatorSelected = false;
	}
	if (typeSelected) {
		let original_main = mainTag.cloneNode(true);
		let thisMain = document.getElementsByTagName('main')[0];
		thisMain.remove();
		mainDiv.appendChild(original_main);
		sort_btn.innerHTML = '<i class="fas fa-sort-alpha-down"></i>';
		if (previous_type!='') {
			previous_type.style.backgroundColor='';
			previous_type.onmouseenter = function(){};
			previous_type.onmouseleave = function(){};
		}
		typeSub.onmouseenter = function (){scrollBack(this)};
		typeSub.onmouseleave = function (){};
		typeSelected = false;
	}
	if (typeSub)
		typeSub.style.backgroundColor = '';
	if (creatorSub)
		creatorSub.style.backgroundColor = '';
	notReverse = false;
}

function scrollBack(sub) {
   sub.childNodes[3].scrollTo(0,0);
}
function modifyDisplay(sub) {
   sub.getElementsByClassName('sub-menu')[0].style.display = "";
 }
 var prevScrollpos = window.pageYOffset;
 window.onscroll = function() {

 var currentScrollPos = window.pageYOffset;
 subMenus = document.getElementsByClassName("sub-menu");
 subMenus[0].style.display = "";
 subMenus[1].style.display = "";
 if ((prevScrollpos < currentScrollPos)||(prevScrollpos > currentScrollPos)) {
   subMenus[0].style.display = "none";
   subMenus[1].style.display = "none";
 }
 prevScrollpos = currentScrollPos;
}

function mobileNotSupported(){
    w = screen.width;
    let bod = document.getElementsByTagName('body')[0];
    if(w < 400){
        bod.remove();
        newBod = document.createElement('body');
        newBod.innerHTML = 'Mobile Version Of This Website Isn\'t Available As Of Now. Please Consider Switching To PC For Better Experience.';
        newBod.style = "background-image: url(https://i.imgur.com/CC8vwXy.png);background-size: auto;background-color: #97d6f8;background-position-y: 35%;text-align: center;margin: 95% 10px 0;color: #1e6394;";
        bod.style.display = 'none';
        docHtml = document.getElementsByTagName('html')[0];
        docHtml.appendChild(newBod);
    }
}

function scrollFunction() {
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		scrollToTop.style.display = "block";
	} 
	else {
		scrollToTop.style.display = "none";
	}
}

var scrollToTop = document.getElementById("stt");
window.onscroll = function() {scrollFunction()};

fetchJSON();
setTimeout(function(){
	if(document.getElementsByTagName('main')[0].childNodes.length==1){
	    location.reload();
	    console.log('Reloading...');
	    return;
	}
	content_list();
	add_subMenu_content(creators,creators_lc,0);
	add_subMenu_content(lengths,lengths_lc,1);
	add_subMenu_content(categories,categories_lc,2);
	add_subMenu_content(dimensions,dimensions_lc,3);
	alphaSort();
}, 1000);
