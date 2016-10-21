$(function(){
    var loadItems, deleteItem, displayItems, addItem;

    loadItems = function(){
        $.ajax({
            url: './api.php',
            method: 'get',
            data: {},
            success: displayItems,
            dataType: 'json'
        });
    };

    deleteItem = function(item){
        $.ajax({
            url : './api.php?id='+item.id,
            method : 'delete',
            success : loadItems
        });
    };

    displayItems = function(items){
        var $itemsContainer = $('#fridge-items').empty();
        if(items.length > 0){
            $('#fridge-empty').hide();
            $itemsContainer.show();
            $(items).each(function(i, item){
                var $deleteButton = $('<button type="button" class="btn btn-xs btn-danger">')
                    .append('<i class="fa fa-times">')
                    .append(' Löschen')
                    .on('click', function(evt){
                        deleteItem(item);
                    });
                $('<div class="fridge-item">')
                    .append('<div class="name">'+item.name+'</div>')
                    .append('<div class="owner"><i class="fa fa-user"></i>'+item.owner+'</div>')
                    .append('<div class="bbd"><i class="fa fa-hourglass-end"></i>'+item.bbd+'</div>')
                    .append('<div class="description">'+item.description+'</div>')
                    .append('<div class="ingredients">'+item.ingredients+'</div>')
                    .append($('<div class="delete">').append($deleteButton))
                    .appendTo($('<div class="fridge-item-col col-lg-2 col-md-3 col-sm-4">').appendTo($itemsContainer));
            });
        } else {
            $('#fridge-empty').show();
            $itemsContainer.hide();
        }
    };

    addItem = function(){
        var $form = $('#createItem-modal form');
        var item = {
            name : $form.find('[name=name]').val() ,
            owner : $form.find('[name=owner]').val() ,
            bbd : $form.find('[name=bbd]').val() ,
            description : $form.find('[name=description]').val() ,
            ingredients : $form.find('[name=ingredients]').val()
        };
        $.ajax({
            url: './api.php',
            method: 'post',
            data: item,
            success: loadItems,
            dataType: 'json'
        });
    };

    loadItems();
    $('#createItem-modal form').on('submit', function(){
        addItem();
        $('#createItem-modal').modal('hide');
        return false;
    });
});

