const filter= document.getElementById('filter');

// Filter To search through the Posts

filter.addEventListener('keyup',filtering)

function filtering(e){
    var text= e.target.value.toLowerCase();
    var items = document.querySelectorAll('.postTitle');
    items.forEach((item)=>{

        // we used a new variable and firstchild cause li contains text and a button and we want the text only
        var itemName=item.lastElementChild.textContent;
        if(itemName.toLowerCase().indexOf(text) != -1)
        {
            item.parentElement.parentElement.style.display='';
        }
        else{
            item.parentElement.parentElement.style.display='none';
        }
    })
}