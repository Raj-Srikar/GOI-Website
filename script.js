var notReverse = true, isHalloween = true, filterEnabled = false, getAlphaMain = true;
mainTag = document.getElementsByTagName('main')[0];

function embed(link) {
	link = String(link)
	if (link.includes('?t') || link.includes('&t')){
		link = link.replace('?t', '?start');
		link = link.replace('&t', '?start');
		time = link.substr(link.indexOf('?start=')+'?start='.length);
		if (time.includes('s')) {
			if (time.includes('m')) {
				mins = parseInt(time.split('m')[0]);
				secs = parseInt(time.substring(time.indexOf('m')+1,time.length-1));
				time = mins*60+secs;
			}
			else{
				time = time.substring(0,time.length-1);
			}
			link = link.substr(0,link.indexOf('?start=')+'?start='.length)+time;
		}
	}
	embeded = link.replace('watch?v=','embed/');
	if (link == embeded)
		embeded = link.replace('youtu.be', 'youtube.com/embed');
	return embeded;
}

creators = new Set();
lengths = new Set();
categories = new Set();
dimensions = new Set();
var mapsJSON;
function fetchJSON() {
	fetch('https://opensheet.elk.sh/11bmvaGVkJtoERDa9Caobigt3s7EsLEpEFqaVB2Gb2Xk/map_data')
	.then(response=>response.json())
	.then(data=>{
		mapsJSON = data;
		displayMaps(data);
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
	});
}

function displayMaps(maps) {
	let htmlString = maps.map((map)=>{
		let isHalloweenMap = map['Category / Type / Style'].includes('Halloween');
		string = `
		<article ${isHalloweenMap ? 'class="halloween-map" title="Halloween Map"' : ''}>
			<div>`;
		string +=
			map['Video']
			?`<iframe src="${embed(map['Video'])}" srcdoc="<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=${embed(map['Video'])}><img src=https://img.youtube.com/vi/${embed(map['Video']).substr(embed(map['Video']).indexOf('embed/')+6,11)}/hqdefault.jpg><span>▶</span></a>" loading="lazy" allowfullscreen=""></iframe>`
			: `<img src="images/noVideo.png">`;
		string += `</div>
			<h2 title="Download ${map['Map Name']}"><a href="${map['Download']}" target="_blank">${map['Map Name']}</a></h2>`;
		if (isHalloweenMap) string += `<img src="images/halloween/moonbats.png" class="moonbats">`;
		string += `
			<p><b>Creator:</b><span>${map['Author']}</span>
				<br><b>Map Type:</b><span>`;
		mapType = map["Length"] + ' ' + map["Category / Type / Style"] + ' ' + map["3D / 2.5D / 2D"];
		string += `${mapType.trim().length !== 0 ? mapType : 'Not Specified'}</span></p>`;
		if (isHalloweenMap) string += `<img src="images/halloween/jacko.png" class="jacko">`;
		string += `
		</article>
		`;
		if (mainTag.innerHTML.trim() == '') {
			creators.add(map["Author"]);
			lengths.add(map["Length"]);
			categories.add(map["Category / Type / Style"]);
			dimensions.add(map["3D / 2.5D / 2D"]);
		}
		return string;
	}).join('');
	document.getElementsByTagName('main')[0].innerHTML = htmlString;
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

function apply_halloween_theme() {
	let bodyTag = document.getElementsByTagName('body')[0];
	let headerTag = document.getElementsByTagName('header')[0];
	let tagLine = headerTag.getElementsByTagName('p')[0];
	let halloweenButton = document.getElementById('halloweenSort');
	let navATags = headerTag.getElementsByTagName('a');

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

function remove_halloween_theme() {
	let bodyTag = document.getElementsByTagName('body')[0];
	let headerTag = document.getElementsByTagName('header')[0];
	let tagLine = headerTag.getElementsByTagName('p')[0];
	let halloweenButton = document.getElementById('halloweenSort');
	let navATags = headerTag.getElementsByTagName('a');

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

	let oldMain = document.getElementsByTagName('main')[0];
	let halloweenMaps = oldMain.getElementsByClassName('halloween-map');
	let newMain = document.createElement('main');

	if (isHalloween) {
		apply_halloween_theme();
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
		remove_halloween_theme();
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


var previous_content='', contentSub = false;
function filter_by_content(content_tag, index) {
	sort_btn.innerHTML = '<i class="fas fa-sort-alpha-down"></i>';
	notReverse = false;
	let subs = document.getElementsByClassName('sub');
	for (var i = 0; i < subs.length; i++) {
		subs[i].style.backgroundColor='';
		subs[i].onmouseenter = function(){scrollBack(this)};
		subs[i].onmouseleave = function(){};
	}
	if (previous_content!='') {
		previous_content.style.backgroundColor='';
		previous_content.onmouseenter = function(){};
		previous_content.onmouseleave = function(){};
	}
	content = content_tag.innerText;
	contentSub = content_tag.parentNode.parentNode;
	contentSub.style.backgroundColor = '#b4ffc7';
	contentSub.onmouseenter = function (){this.style.backgroundColor = '#91eaa8';scrollBack(this)};
	contentSub.onmouseleave = function (){this.style.backgroundColor = '#b4ffc7';};
	
	content_tag.style.backgroundColor = '#b4ffc7';
	content_tag.onmouseenter =  function () {this.style.backgroundColor = '#91eaa8';}
	content_tag.onmouseleave = function(){this.style.backgroundColor = '#b4ffc7';}
	content_tag.parentNode.style.display = 'none';

	filteredContent = mapsJSON.filter(obj => {
		if (index==0)
			return content == obj['Author']
		else{
			let spantext = obj['Length'] + ' ' + obj["Category / Type / Style"] + ' ' + obj["3D / 2.5D / 2D"];
			return spantext.toLowerCase().includes(content.toLowerCase());
		}
	});

	displayMaps(filteredContent);

	filterEnabled = true;
	previous_content = content_tag;
	deselect_filter_halloween = false;
}

function deselect_content_filter() {
	let original_main = mainTag.cloneNode(true);
	let thisMain = document.getElementsByTagName('main')[0];
	thisMain.remove();
	mainDiv.appendChild(original_main);
	sort_btn.innerHTML = '<i class="fas fa-sort-alpha-down"></i>';
	if (previous_content!='') {
		previous_content.style.backgroundColor='';
		previous_content.onmouseenter = function(){};
		previous_content.onmouseleave = function(){};
	}
	contentSub.onmouseenter = function (){scrollBack(this)};
	contentSub.onmouseleave = function (){};
	filterEnabled = false;
	contentSub.style.backgroundColor = '';
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
