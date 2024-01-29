var isReverse = false, isHalloween = true, filterEnabled = false, getAlphaMain = true,
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

var creators = new Set(),
lengths = new Set(),
dimensions = new Set(),
mapsJSON, halloweenMaps;
function fetchJSON() {
	fetch('https://opensheet.elk.sh/11RYN1a8vMGeRxP3kmC6BMLXVMA0TxTA6RFtjCBuwRxw/Maps')
	.then(response=>response.json())
	.then(data=>{
		mapsJSON = data;
		mapsJSON.sort((a,b)=>((a['Map Name'].toLowerCase()>b['Map Name'].toLowerCase())?1:(b['Map Name'].toLowerCase()>a['Map Name'].toLowerCase())?-1:0));
		displayMaps(mapsJSON);
		halloweenMaps = mapsJSON.filter((map)=>{if(map['Comments / Notes']) return map['Comments / Notes'].toLowerCase().includes('halloween')});
		creators = [...creators].sort((b,c)=>b.toLowerCase()<c.toLowerCase()?-1:1).filter(ele => ele.length);
		lengths = [...lengths].sort((b,c)=>b.toLowerCase()<c.toLowerCase()?-1:1).filter(ele => ele.length);
		lengths.splice(lengths.indexOf('NA'), 1);
		dimensions = [...dimensions].sort((b,c)=>b.toLowerCase()<c.toLowerCase()?-1:1).filter(ele => ele.length);
	});
}

function displayMaps(maps) {
	let htmlString = maps.map((map)=>{
		if (!map['Download']) return '';
		let isHalloweenMap = map['Comments / Notes'] ? map['Comments / Notes'].toLowerCase().includes('halloween') : map['Comments / Notes'],
		embedLink = embed(map['Video']);
		string = `
		<article ${isHalloweenMap ? 'class="halloween-map" title="Halloween Map"' : ''}>
			<div>`;
		string +=
			map['Video']
			?`<iframe src="${embedLink}" srcdoc="<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=${embedLink}><img src=https://img.youtube.com/vi/${embedLink.substr(embedLink.indexOf('embed/')+6,11)}/hqdefault.jpg><span>▶</span></a>" loading="lazy" allowfullscreen=""></iframe>`
			: `<img src="images/noVideo.png">`;
		string += `</div>
			<h2 title="Download ${map['Map Name']}"><a href="${map['Download']}" target="_blank">${map['Map Name']}</a></h2>`;
		if (isHalloweenMap) string += `<img src="images/halloween/moonbats.png" class="moonbats">`;
		string += `
			<p><b>Creator:</b><span>${map['Author']}</span>
				<br><b>Map Type:</b><span>`;
		mapType = (map["Length"].includes('NA') ? '' : map["Length"]) + ' ' /*+ map["Tags"] + ' ' */+ map["Type"];
		string += `${mapType.trim().length !== 0 ? mapType : 'Not Specified'}</span></p>`;
		if (isHalloweenMap) string += `<img src="images/halloween/jacko.png" class="jacko">`;
		string += `
		</article>
		`;
		if (mainTag.innerHTML.trim() == '') {
			if(!map["Author"].includes('&'))creators.add(map["Author"]);
			lengths.add(map["Length"]);
			dimensions.add(map["Type"]);
		}
		return string;
	}).join('');
	document.getElementsByTagName('main')[0].innerHTML = htmlString;
}


var sort_btn = document.getElementById('alphaSort');
function alphaSort() {
	if (isReverse) {
		sort_btn.innerHTML = '<i class="fas fa-sort-alpha-down"></i>';
		searchedContent ? displayMaps(searchedContent) : filterEnabled ? displayMaps(filteredContent) : isHalloween ? displayMaps(mapsJSON) : displayMaps(halloweenMaps);
		isReverse = false;
	}
	else{
		sort_btn.innerHTML = '<i class="fas fa-sort-alpha-down-alt"></i>';
		reversedMaps =  searchedContent ? [...searchedContent].reverse() : filterEnabled ? [...filteredContent].reverse() : isHalloween ? [...mapsJSON].reverse() : [...halloweenMaps].reverse();
		displayMaps(reversedMaps);
		isReverse = true;
	}
}


function toggle_halloween_theme() {
	let bodyTag = document.getElementsByTagName('body')[0];
	let headerTag = document.getElementsByTagName('header')[0];
	let tagLine = headerTag.getElementsByTagName('p')[0];
	let halloweenButton = document.getElementById('halloweenSort');
	let nav = headerTag.querySelector('nav');

	bodyTag.classList.toggle('hallo-body');
	headerTag.classList.toggle('hallo-header');
	tagLine.classList.toggle('hallo-tagline');
	halloweenButton.classList.toggle('hallo-btn');
	nav.classList.toggle("scythes");
	document.getElementById('filterBy').classList.toggle('disable');
	document.getElementById('search-bar').classList.toggle('disable');
	let alphaSortTag = document.getElementById('alphaSort');
	alphaSortTag.classList.toggle('hallo-alpha');
}

var deselect_filter_halloween = true;
function halloweenSort() {
	if (!deselect_filter_halloween) {
		deselect_content_filter(true);
	}

	toggle_halloween_theme();
	let spiderWebDiv = document.getElementById('spiderWebDiv')
	spiderWebDiv.classList.toggle('disable');
	if (isHalloween) {
		!isReverse ? displayMaps(halloweenMaps) : displayMaps([...halloweenMaps].reverse());
		isHalloween = false;
		spiderWebDiv.innerHTML += '<img src="images/halloween/spida.png" id="spider"><span id="webthread"></span>';
	}
	else{
		displayMaps(mapsJSON);
		isHalloween = true;
		document.getElementById('spider').remove();
		document.getElementById('webthread').remove();
		isReverse = false;
		document.querySelector('#alphaSort>i').className = 'fas fa-sort-alpha-down';
	}
}


function add_subMenu_content(content, index) {
	let subMenu = document.getElementsByClassName('sub-menu')[index];
	for (i = 0; i < content.length; i++) {
		let subDiv = document.createElement('div');
		subDiv.onclick = function(){filter_by_content(this, index)}
		subDiv.innerHTML = content[i];
		subMenu.appendChild(subDiv);
	}
}

var previous_content='', contentSub = false;
function filter_by_content(content_tag, index) {
	sort_btn.innerHTML = '<i class="fas fa-sort-alpha-down"></i>';
	isReverse = false;
	let subs = document.getElementsByClassName('sub');
	for (var i = 0; i < subs.length; i++) {
		subs[i].style.backgroundColor='';
		subs[i].onmouseenter = function(){subMenuScrollBack(this)};
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
	contentSub.onmouseenter = function (){this.style.backgroundColor = '#91eaa8';subMenuScrollBack(this)};
	contentSub.onmouseleave = function (){this.style.backgroundColor = '#b4ffc7';};
	
	content_tag.style.backgroundColor = '#b4ffc7';
	content_tag.onmouseenter =  function () {this.style.backgroundColor = '#91eaa8';}
	content_tag.onmouseleave = function(){this.style.backgroundColor = '#b4ffc7';}
	content_tag.parentNode.style.display = 'none';

	filteredContent = mapsJSON.filter(obj => {
		if (index==0)
			return obj['Author'].includes(content);
		else{
			let spantext = obj['Length'] + ' ' + obj["Type"];
			return spantext.toLowerCase().includes(content.toLowerCase());
		}
	});
	
	search.value = '';
	searchedContent = '';

	displayMaps(filteredContent);

	filterEnabled = true;
	previous_content = content_tag;
	deselect_filter_halloween = false;
}

function deselect_content_filter(fromSort = false) {
	if (!fromSort) displayMaps(mapsJSON);
	sort_btn.innerHTML = '<i class="fas fa-sort-alpha-down"></i>';
	if (previous_content!='') {
		previous_content.style.backgroundColor='';
		previous_content.onmouseenter = function(){};
		previous_content.onmouseleave = function(){};
	}
	contentSub.onmouseenter = function (){subMenuScrollBack(this)};
	contentSub.onmouseleave = function (){};
	filterEnabled = false;
	contentSub.style.backgroundColor = '';
	isReverse = false;
	search.value = '';
	searchedContent = '';
}

function subMenuScrollBack(sub) {
   sub.childNodes[3].scrollTo(0,0);
}
function modifyDisplay(sub) {
   sub.getElementsByClassName('sub-menu')[0].style.display = "";
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

async function waitForMapTiles(callback){
    if (document.getElementsByTagName('main')[0].childNodes.length>1) {
        callback();
    } else {
        setTimeout(function () {
            waitForMapTiles(callback);
        }, 1000);
    }
}
fetchJSON();
waitForMapTiles(()=>{
	add_subMenu_content(creators,0);
	add_subMenu_content(lengths,1);
	add_subMenu_content(dimensions,2);
});

search=document.getElementById('search');
searchIcon = document.querySelector('#search-bar i');
searchedContent = '';
search.addEventListener('keyup',(e) =>{
    let searchString = e.target.value.trim().toLowerCase();
    if (searchString.length <= 2){
    	search.style = '';
    	searchIcon.style.color = '';
    	if (document.getElementsByTagName('article').length != mapsJSON.length && !filterEnabled && !isReverse){
    		displayMaps(mapsJSON);
			searchedContent = '';
    	}
    	else if (filterEnabled) {
    		if (isReverse) {
	    		displayMaps(reversedMaps);
	    		reversedMaps = [...filteredContent].reverse();
			}
			else
	    		displayMaps(filteredContent);
			searchedContent = '';
    	}
    	else if (isReverse) {
    		displayMaps(reversedMaps);
    		reversedMaps = [...mapsJSON].reverse();
    		searchedContent = '';	
    	}
    }
    else{
    	if (!filterEnabled && !isReverse) {
		    searchedContent = mapsJSON.filter((map) => {
		        return map['Map Name'].toLowerCase().includes(searchString);
		    });
		}
		else if (filterEnabled) {
			searchedContent = filteredContent.filter((map) => {
		        return map['Map Name'].toLowerCase().includes(searchString);
		    });
		    if (isReverse)
		    	searchedContent = [...filteredContent].reverse().filter((map) => {
			        return map['Map Name'].toLowerCase().includes(searchString);
			    });
		}
		else if (isReverse) {
			searchedContent = reversedMaps.filter((map) => {
		        return map['Map Name'].toLowerCase().includes(searchString);
		    });
		}
	    if (searchedContent.length == 0) {
	    	searchIcon.style.color = '#dd2929';
	    	search.style = 'background-color:#ffe2e2;color:#a30000;';
	    	if (document.getElementsByTagName('article').length != mapsJSON.length && !filterEnabled){
	    		displayMaps(mapsJSON);
				searchedContent = '';
	    	}
	    	else if (filterEnabled) {
	    		if (isReverse) {
		    		displayMaps(reversedMaps);
		    		reversedMaps = [...filteredContent].reverse();
	    		}
	    		else
		    		displayMaps(filteredContent);
				searchedContent = '';
	    	}
	    	else if (isReverse) {
	    		displayMaps(reversedMaps);
	    		reversedMaps = [...mapsJSON].reverse();
	    		searchedContent = '';	
	    	}
	    }
	    else{
		    displayMaps(searchedContent);
		    if (isReverse) {
		    	searchedContent = mapsJSON.filter((map) => {
			        return map['Map Name'].toLowerCase().includes(searchString);
			    });
		    }
	    	search.style = '';
	    	searchIcon.style.color = '';
	    }
	}
});