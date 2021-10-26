var notReverse = true, isHalloween = true, creatorSelected = false, lengthSelected = false, getAlphaMain = true;
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

function fetchJSON() {
	fetch('maps.json')
	.then(response=>response.json())
	.then(data=>{
			// body = document.getElementsByTagName('body')[0];
			// main = document.getElementsByTagName('main')[0];
			// body.appendChild(mainTag);
			for (var i = 0; i < data.length; i++) {
				newArticle = document.createElement('article');
				divTag = document.createElement('div');
				embedTag = document.createElement('embed');
				h2Tag = document.createElement('h2');
				anchTag = document.createElement('a');
				paraTag = document.createElement('p');
				boldTag1 = document.createElement('b');
				spanTag1 = document.createElement('span');
				brTag = document.createElement('br');
				boldTag2 = document.createElement('b');
				spanTag2 = document.createElement('span');
				embedTag.setAttribute('src',embed(data[i].video));
				divTag.appendChild(embedTag);
				h2Tag.setAttribute('title','Download '+data[i].map);
				anchTag.setAttribute('href',data[i].drive);
				anchTag.setAttribute('target','_blank');
				anchTag.innerHTML=data[i].map;
				h2Tag.appendChild(anchTag);
				boldTag1.innerHTML='Creator:';
				spanTag1.innerHTML=data[i].creator;
				boldTag2.innerHTML='Length:';
				spanTag2.innerHTML=data[i].length;
				paraTag.appendChild(boldTag1);
				paraTag.appendChild(spanTag1);
				paraTag.appendChild(brTag);
				paraTag.appendChild(boldTag2);
				paraTag.appendChild(spanTag2);
				newArticle.appendChild(divTag);
				newArticle.appendChild(h2Tag);
				if (data[i].halloween) {
					newArticle.className = 'halloween-map';
					newArticle.title = 'Halloween Map'
					img1 = document.createElement('img');
					img1.src="images/halloween/moonbats.png";
					img1.className = "moonbats";
					newArticle.appendChild(img1);
				}
				newArticle.appendChild(paraTag);
				if (data[i].halloween) {
					img2 = document.createElement('img');
					img2.src="images/halloween/jacko.png";
					img2.className = "jacko";
					newArticle.appendChild(img2);
				}
				mainTag.appendChild(newArticle);
			}
			// body.appendChild(main);
		}
	)
}

function alphaSort() {
	let oldMain = document.getElementsByTagName('main')[0];
	mapNames = [];
	anchs = oldMain.getElementsByTagName('a');
	sort_btn = document.getElementById('alphaSort')

	for(i=0;i<anchs.length;i++){
	    mapNames[i]=anchs[i].innerHTML.trim().toLowerCase()
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

	let newMain = document.createElement('main');
	for(i=0;i<anchs.length;i++){
	    for(j=0;j<anchs.length;j++){
		    anch = anchs[j]
		    thisMap = anch.innerText.trim();
		    article = anch.parentNode.parentNode.cloneNode(true);
	        if(mapNames[i]==thisMap.toLowerCase()){
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

function apply_halloween_theme(bodyTag, headerTag, tagLine, halloweenButton) {
	bodyTag.style = "background-image: linear-gradient(#00000033, #00000033), url(https://www.wallpapertip.com/wmimgs/67-676387_halloween-wallpapers-hd-3-halloween-night-wallpaper-hd.jpg);";
	headerTag.style = "background-image: linear-gradient(to left, #00000055, #00000055), url(https://cdn.wallpapersafari.com/49/15/H0xLQG.jpg);background-position-y: 90%;box-shadow: 0px 5px 20px 5px rgb(255 94 0 / 30%);";
	tagLine = "color: #e2ddd5;";
	halloweenButton.style = "color:red;background-color: black;border: 2px solid red;box-shadow: 0px 0px 10px 5px #b94646;";
	halloweenButton.onmouseenter = function(){halloweenButton.style.color='#ffe002';halloweenButton.style.boxShadow='orangered 0px 0px 10px 5px'};
	halloweenButton.onmouseleave = function(){halloweenButton.style.color='red';halloweenButton.style.boxShadow='#b94646 0px 0px 10px 5px'};
}

function remove_halloween_theme(bodyTag, headerTag, tagLine, halloweenButton) {
	bodyTag.style = "";
	headerTag.style = "";
	tagLine = "";
	halloweenButton.style = "";
	halloweenButton.onmouseenter = function(){};
	halloweenButton.onmouseleave = function(){};
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

	let oldMain = document.getElementsByTagName('main')[0];
	halloweenMaps = oldMain.getElementsByClassName('halloween-map');
	let newMain = document.createElement('main');

	if (isHalloween) {
		apply_halloween_theme(bodyTag, headerTag, tagLine, halloweenButton);
		for (var i = 0; i < halloweenMaps.length; i++) {
			newMain.appendChild(halloweenMaps[i].cloneNode(true));
		}
		isHalloween = false;

		spiderWebDiv = document.createElement('div');
		spiderWebDiv.innerHTML = '<img src="images/halloween/web-top-left.png" style="top:0;left:0"><img src="images/halloween/web-bottom-left.png" style="bottom:0;left:0"><img src="images/halloween/web-bottom-right.png" style="bottom:0;right:0"><img src="images/halloween/web-top-right.png" style="top:0;right:0;width: 18%;">';
		spiderWebDiv.setAttribute('id', 'spiderWebDiv');
		document.getElementsByTagName('body')[0].appendChild(spiderWebDiv);
	}
	else{
		remove_halloween_theme(bodyTag, headerTag, tagLine, halloweenButton);
		newMain = mainTag;
		isHalloween = true;
		document.getElementById('spiderWebDiv').remove();
	}


	oldMain.remove();
	mainDiv.appendChild(newMain)
}

spans = mainTag.getElementsByTagName('span');

creators = []
lengths = []
creators_lc = []
lengths_lc = []

function content_list() {
	for(i=0;i<spans.length/2;i++){
	    creators.push(spans[i*2].innerHTML.trim())
	}

	creators.sort();
	histo = {}

	for(i=0;i<creators.length;i++){
	    if(!(creators[i] in histo)){
	        histo[creators[i]] = 1;
	    }
	    else{
	        histo[creators[i]] += 1;
	    }
	}

	creators = []
	for(i in histo){
	    creators.push(i)
	}
	for (var i = 0; i < creators.length; i++) {
		creators_lc[i] = creators[i].toLowerCase();
		creators_lc.sort();
	}


	for(i=1;i<spans.length;i+=2){
	    lengths.push(spans[i].innerHTML.trim())
	}

	lengths.sort();
	histo = {}

	for(i=0;i<lengths.length;i++){
	    if(!(lengths[i] in histo)){
	        histo[lengths[i]] = 1;
	    }
	    else{
	        histo[lengths[i]] += 1;
	    }
	}

	lengths = []
	for(i in histo){
	    lengths.push(i)
	}
	for (var i = 0; i < lengths.length; i++) {
		lengths_lc[i] = lengths[i].toLowerCase();
		lengths_lc.sort();
	}
}

// sorted_lengths = [];
// for (i = 0; i < lengths_lc.length; i++) {
// 	for (var j = 0; j < lengths.length; j++) {
// 		if (lengths_lc[i]==lengths[j].toLowerCase()){
// 			sorted_lengths.push(lengths[j]);
// 			break;
// 		}
// 	}
// }

function add_subMenu_content(content, lc, zeroOne) {
	let subMenu = document.getElementsByClassName('sub-menu')[zeroOne];
	for (i = 0; i < lc.length; i++) {
		let subDiv = document.createElement('div');
		subDiv.onclick = function(){filter_by_content(this, zeroOne)}
		for (var j = 0; j < content.length; j++) {
			if (lc[i]==content[j].toLowerCase()){
				subDiv.innerHTML = content[j];
				break;
			}
		}
		subMenu.appendChild(subDiv);
	}
}


var previous_creator='', previous_length='';
function filter_by_content(content_tag, zeroOne) {
	sort_btn.innerHTML = '<i class="fas fa-sort-alpha-down"></i>';
	notReverse = false;
	if (!isHalloween) {halloweenSort()}
	let subs = document.getElementsByClassName('sub');
	lengthParent = subs[1];
	lengthParent.style.backgroundColor='';
	lengthParent.onmouseenter = function(){};
	lengthParent.onmouseleave = function(){};
	creatorParent = subs[0];
	creatorParent.style.backgroundColor='';
	creatorParent.onmouseenter = function(){};
	creatorParent.onmouseleave = function(){};
	if (previous_creator!='') {
		previous_creator.style.backgroundColor='';
		previous_creator.onmouseenter = function(){};
		previous_creator.onmouseleave = function(){};
	}
	if (previous_length!='') {
		previous_length.style.backgroundColor='';
		previous_length.onmouseenter = function(){};
		previous_length.onmouseleave = function(){};
	}
	content = content_tag.innerText;
	creatorSub = content_tag.parentNode.parentNode;
	lengthSub = content_tag.parentNode.parentNode;
	if (zeroOne==0){
		creatorSub.style.backgroundColor = '#b4ffc7';
		creatorSub.onmouseenter = function (){this.style.backgroundColor = '#91eaa8';};
		creatorSub.onmouseleave = function (){this.style.backgroundColor = '#b4ffc7';};
	}
	else if (zeroOne==1) {
		lengthSub.style.backgroundColor = '#b4ffc7';
		lengthSub.onmouseenter = function (){this.style.backgroundColor = '#91eaa8';};
		lengthSub.onmouseleave = function (){this.style.backgroundColor = '#b4ffc7';};
	}
	content_tag.style.backgroundColor = '#b4ffc7';
	content_tag.onmouseenter =  function () {this.style.backgroundColor = '#91eaa8';}
	content_tag.onmouseleave = function(){this.style.backgroundColor = '#b4ffc7';}
	content_tag.parentNode.style.display = 'none';
	articles = mainTag.getElementsByTagName('article');
	newMainTag = document.createElement('main');
	newMainTag = mainTag;
	thisMain = document.getElementsByTagName('main')[0];
	thisMain.remove();
	mainDiv.appendChild(newMainTag);
	thisMain = document.getElementsByTagName('main')[0];
	mainByCreator = document.createElement('main');
	for(i=0;i<articles.length;i++){
	    checkName = articles[i].getElementsByTagName('span')[zeroOne].innerText;
	    if(checkName==content)    
	        mainByCreator.appendChild(articles[i].cloneNode(true));
	}
	thisMain.remove();
	mainDiv.appendChild(mainByCreator);
	if (zeroOne==0) {
		creatorSelected = true;
		previous_creator = content_tag;
	}
	else if (zeroOne==1) {
		lengthSelected = true;
		previous_length = content_tag;
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
		creatorSub.onmouseenter = function (){};
		creatorSub.onmouseleave = function (){};
		creatorSelected = false;
	}
	if (lengthSelected) {
		let original_main = mainTag.cloneNode(true);
		let thisMain = document.getElementsByTagName('main')[0];
		thisMain.remove();
		mainDiv.appendChild(original_main);
		sort_btn.innerHTML = '<i class="fas fa-sort-alpha-down"></i>';
		if (previous_length!='') {
			previous_length.style.backgroundColor='';
			previous_length.onmouseenter = function(){};
			previous_length.onmouseleave = function(){};
		}
		lengthSub.onmouseenter = function (){};
		lengthSub.onmouseleave = function (){};
		lengthSelected = false;
	}
	lengthSub.style.backgroundColor = '';
	creatorSub.style.backgroundColor = '';
	notReverse = false;
}

function scrollBack(dropdown) {
   let subMenu = dropdown.getElementsByClassName('sub-menu');
   subMenu[0].scrollTo(0,0);
   subMenu[1].scrollTo(0,0);
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
    if(w < 375){
        bod.remove();
        newBod = document.createElement('body');
        newBod.innerHTML = 'Mobile Version Of This Website Isn\'t Available As Of Now. Please Consider Switching To PC For Better Experience.';
        newBod.style = "background-image: url(https://i.imgur.com/CC8vwXy.png);background-size: auto;background-color: #97d6f8;background-position-y: 35%;text-align: center;margin: 95% 10px 0;color: #1e6394;";
        bod.style.display = 'none';
        docHtml = document.getElementsByTagName('html')[0];
        docHtml.appendChild(newBod);
    }
}

fetchJSON();
setTimeout(function(){
	content_list();
	add_subMenu_content(creators,creators_lc,0);
	add_subMenu_content(lengths,lengths_lc,1);
	alphaSort();
}, 1000);
mobileNotSupported()