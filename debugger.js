var elbtn = $('button.ui_v5-button-component:nth-child(4)');
elbtn.addEventListener('click', function(){
  console.log($('input.ui_v5-input-component:nth-child(3)').value);
}) 