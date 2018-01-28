
var recipes;

fetch('recipes.json').then(function(response) {
  if(response.ok) {
    response.json().then(function(json) {
      recipes = json;
      initialize();
    });
  } else {
    console.log('Network request for recipes.json failed with response ' + response.status + ': ' + response.statusText);
  }
});


function initialize() {

  var category = document.querySelector('#category');
  var searchTerm = document.querySelector('.searchTerm');
  var searchBtn = document.querySelector('.searchButton');
  var main = document.querySelector('main');


  var lastCategory = category.value;
  var lastSearch = searchTerm.value;

  var categoryGroup;
  var finalGroup;


  finalGroup = recipes;
  updateDisplay();


  categoryGroup = [];
  finalGroup = [];


  searchBtn.onclick = selectCategory;

  function selectCategory(e) {

    e.preventDefault();


    categoryGroup = [];
    finalGroup = [];

    if(category.value === lastCategory && searchTerm.value === lastSearch) {
      return;
    } else {

      lastCategory = category.value;
      lastSearch = searchTerm.value;

      if(category.value === 'All') {
        categoryGroup = recipes;
        selectrecipes();

      } else {

        var lowerCaseType = category.value.toLowerCase();
        for(var i = 0; i < recipes.length ; i++) {

          if(recipes[i].type === lowerCaseType) {
            categoryGroup.push(recipes[i]);
          }
        }


        selectrecipes();
      }
    }
  }


  function selectrecipes() {

    if(searchTerm.value === '') {
      finalGroup = categoryGroup;
      updateDisplay();
    } else {

      var lowerCaseSearchTerm = searchTerm.value.toLowerCase();

      for(var i = 0; i < categoryGroup.length ; i++) {
        if(categoryGroup[i].name.indexOf(lowerCaseSearchTerm) !== -1) {
          finalGroup.push(categoryGroup[i]);
        }
      }


      updateDisplay();
    }

  }


  function updateDisplay() {

    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }


    if(finalGroup.length === 0) {
      var para = document.createElement('p');
      para.textContent = 'No results to display!';
      main.appendChild(para);

    } else {
      for(var i = 0; i < finalGroup.length; i++) {
        fetchBlob(finalGroup[i]);
      }
    }
  }


  function fetchBlob(product) {

    var url = '../img/' + product.image;

    fetch(url).then(function(response) {
      if(response.ok) {
        response.blob().then(function(blob) {

          objectURL = URL.createObjectURL(blob);

          showProduct(objectURL, product);
        });
      } else {
        console.log('Network request for "' + product.name + '" image failed with response ' + response.status + ': ' + response.statusText);
      }
    });
  }


  function showProduct(objectURL, product) {

    var section = document.createElement('section');
    var heading = document.createElement('h2');
    var para = document.createElement('p');
    var image = document.createElement('img');


    section.setAttribute('class', product.type);


    heading.textContent = product.name.replace(product.name.charAt(0), product.name.charAt(0).toUpperCase());


    para.textContent = '$' + product.price.toFixed(2);


    image.alt = product.name;

  
    main.appendChild(section);
    section.appendChild(heading);
    section.appendChild(para);
    section.appendChild(image);
  }
}
