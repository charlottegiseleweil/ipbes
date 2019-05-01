function addMenu() {
    let menu = document.getElementById('main_menu');


    let first = document.createElement('div')
        first.classList.add('menu_element');
    let today = document.createElement('a');
       today.href = 'index.html';
       today.innerHTML = "Where are people most at risk today?";
    first.appendChild(today);


    let second = document.createElement('div')
        second.classList.add('menu_element');
    let future = document.createElement('a');
       future.href = 'risk_index.html';
       future.innerHTML = "In which contries are people most at risk?";
    second.appendChild(future);


    let third = document.createElement('div')
        third.classList.add('menu_element');
    let dropdown = document.createElement('div');
        dropdown.classList.add('menu_dropdown');
    let dropdown_content = document.createElement('div');
        dropdown_content.classList.add('menu_dropdown-content');

    let dropSymbol = document.createElement('i');
        dropSymbol.classList.add('fa');
        dropSymbol.classList.add('fa-caret-down');
    let poll = document.createElement('a');
        poll.href = 'index.html';
        poll.innerHTML = "Pollination <span class='glyphicon glyphicon-grain'> </span>";
    let wq = document.createElement('a');
        wq.href = 'index.html';
        wq.innerHTML = "Water quality <i class='fa fa-tint' viewBox = '0 0 15 15'>";
    let coast = document.createElement('a');
        coast.href = 'index.html';
        coast.innerHTML = "Coastal Risk <i class='fas fa-water'></i>";

    let services = document.createElement('a');
        services.href = 'index.html';
        services.innerHTML = "Ecosystem Services ";
    services.appendChild(dropSymbol);
    dropdown.appendChild(services);
    dropdown_content.appendChild(poll);
    dropdown_content.appendChild(wq);
    dropdown_content.appendChild(coast);
    dropdown.appendChild(dropdown_content);
    third.appendChild(dropdown);
    
    let forth = document.createElement('div')
        forth.classList.add('menu_element');
        forth.classList.add('about_tab');
    let about = document.createElement('a');
        about.href = 'about.html';
        about.innerHTML = "About";
    forth.appendChild(about);



    menu.appendChild(first);
    menu.appendChild(second);
    menu.appendChild(third);
    menu.appendChild(forth);
   
  }
  function showInfo(info) {
    document.getElementById(info).style.width = "100%";
  }
  
  function hideInfo(info) {
    document.getElementById(info).style.width = "0%";
  }