
$(function(){
 $('#search').on('keyup', function(e){
   if(e.keyCode === 13) {
     var parameters = {
          "fields": {
            "name": $(this).val()
          }
        };
       $.get( '/cards/search',parameters, function(data) {
       $('#results').html(data);
     });
   }else{
     console.log("keycode: "+e.keyCode);
   };
 });
});
