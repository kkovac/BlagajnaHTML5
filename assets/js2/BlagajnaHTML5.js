$(document).ready(function() {

    var strCrossDomainServiceURL = 'http://www.spin.hr/ng/posservice/';
    var stPicturesURL = 'http://127.0.0.1/BlagajnaHTML5/assets/pic/';
    var dataBase = '';

    $(".mysection,.loadergif").hide();

    if ($.Storage.get("BlagajnaHTML5g") != undefined) { $("#g").html($.Storage.get("BlagajnaHTML5g")) };
    if ($.Storage.get("BlagajnaHTML5e") != undefined) { $("#e").val($.Storage.get("BlagajnaHTML5e")) };
    if ($.Storage.get("BlagajnaHTML5p") != undefined) { $("#p").val($.Storage.get("BlagajnaHTML5p")) };
    if ($.Storage.get("BlagajnaHTML5d") != undefined) { $("#d").val($.Storage.get("BlagajnaHTML5d")) };

    $("input[type=text]").focus(function() { $(this).select(); });
    $("input[type=text]").mouseup(function (e) { e.preventDefault(); });

    $('a[href="#"]').click(function (e) { e.preventDefault(); });
 
    $(".printdoc").on('click', function() { window.print(); return false; });
     
    $('form').submit(function (e) { e.preventDefault(); return false; });

    $('#searchproductstext').on("keypress", function (e) {
        if (e.keyCode == 13) {
            $('#searchproductsbutton').trigger('click');
            return false;
        }
    });

    Login();

    //    ================================================================= theme

    var bgindex = "3.jpg";
    if ($.Storage.get("BlagajnaHTML5bgindex") != undefined) { bgindex = $.Storage.get("BlagajnaHTML5bgindex") };
    $.backstretch("assets/css/bg/" + bgindex);
    $('img[data-id="' + bgindex + '"]').removeClass('img-rounded').addClass('img-thumbnail2').css('opacity','1');

    $('.themeimg img,#themeblank').click(function () {
        bgindex = $(this).attr('data-id');
        $.backstretch("assets/css/bg/" + bgindex);
        $.Storage.set({ "BlagajnaHTML5bgindex": bgindex });
        $.Storage.set({ "BlagajnaHTML5AdditionalCSS": $(this).attr('data-css') });
        $("link.additional").attr("href", $(this).attr('data-css'));
        $('.themeimg img').removeClass('img-thumbnail2').addClass('img-rounded').css('opacity', '0.3');
        $('img[data-id="' + bgindex + '"]').removeClass('img-rounded').addClass('img-thumbnail2').css('opacity', '1');
    });

    if ($.Storage.get("BlagajnaHTML5AdditionalCSS") != undefined) {
        $("link.additional").attr("href", $.Storage.get("BlagajnaHTML5AdditionalCSS"))
    }
    else {
        $("link.additional").attr("href", 'assets/css/BlagajnaHTML5FBP.css')
    }
    ;

    $(".themeimg img").hover(function () {
        $(this).animate({  opacity :  1 }, 100);
    }, function () {
        if ($(this).hasClass('img-thumbnail2') == false) { $(this).animate({ opacity: 0.3 }, 100) };
    });

    
    $('.themedugmic').click(function () {
        //$("#themelist").toggle('');
        ShowSection('#themelist');
    });

    //    ================================================================= home 
    $(".brand").click(function () {
        $(".navbutton").removeClass('active');
        $(".brand").addClass('active');
        $(".mysection").hide();
        $("#brandsection").show();
        if ($("#messagelist").html() != '') { GetMessages(); }
    });

    function GetMessages() {
        return
    }

    //    ================================================================= login
    $("#loginbutton").click(function () {
        Login();
    });

    function Login() {
        $("#loginbutton").addClass('disabled').attr('disabled', 'disabled');
        $("#loginloadergif").show();
        $.ajax({
            url: strCrossDomainServiceURL + '?a=login&' + $("#loginform").serialize(),
            type: 'POST',
            cache: false,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            async: true,
            contentType: "application/json;charset=UTF-8",
            success: function (data, status) {
                $("#g").html(data.userguid);
                if (data.userguid != '0') {
                    dataBase = data.database;
                    // $("#usernamenav").html(dataBase + "|" + data.username);
                    $("#usernamenav").html(data.username);
                    $.Storage.set({ "BlagajnaHTML5g": $("#g").html() });
                    $.Storage.set({ "BlagajnaHTML5e": $("#e").val() });
                    $.Storage.set({ "BlagajnaHTML5p": $("#p").val() });
                    $.Storage.set({ "BlagajnaHTML5d": $("#d").val() });
                    $("#loginsection,#btnspremiracun").hide();
                    $("#doccursection").show('slow');
                    //DocList();
                    //NewDocList();
                    //$(".brand").trigger('click');
                    GetDocTotal();
                } else
                { $("#loginbutton").removeClass('disabled').removeAttr('disabled', 'disabled'); }
                $("#loginloadergif").hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert('Login error !');
                $("#loginbutton").removeClass('disabled').removeAttr('disabled', 'disabled');
                $("#loginloadergif").hide();
            }
        });
    }

    // ============================================================================= ENTER AS TAB

    $('.enterastab').on("keypress", function(e) {
        if (e.keyCode == 13) {
            var inputs = $(this).parents("form").eq(0).find(":input");
            var idx = inputs.index(this);

            if (idx == inputs.length - 1) {
                inputs[0].select()
            } else {
                inputs[idx + 1].focus();
                inputs[idx + 1].select();
            }
            return false;
        }
    });

    // ============================================================================= TRAŽILICA ROBE ...
    $(".afterclickfocussearchproductstext").click(function () {
        $("#searchproductstext").focus();
    });

    $("#searchproductsbutton").click(function () {
        GetSearchProductsList();
    });

    function GetSearchProductsList() {
        var strFormattedHTML = '';
        $("#desktoploader,#desktoploader2").show();
        $("#searchproductlist").fadeTo("fast", 0);
        $.ajax({
            url: strCrossDomainServiceURL + '?d=' + $("#d").html() + '&g=' + $("#g").html() + '&a=GetSearchProductsList&s=' + $("#searchproductstext").val(),
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {

                var i5 = 0;
                $.each(data, function (i, item) {
                    i5 = i5 + 1;
                    strFormattedHTML = strFormattedHTML
                    + '<div class="span4   kvadraticzarobu" robaid="' + item.robaid + ' "><div class="Transparent">'
                    + 'Userid : ' + item.userid + ' '
                    + 'Barcode : ' + item.barcode + ' '
                    + '<h4>' + item.mpcijena + 'kn</h3>' + ' '
                    + '<div class="btn-danger btn-large">' + item.naziv + '</div>'
                    + '</div></div>';
                    if (i5 == 3) { i5 = 0; strFormattedHTML = strFormattedHTML + '<div class="clearfix" ></div>' }
                });

                $("#searchproductlist").fadeTo("fast", 1);
                $("#searchproductlist").html('' + strFormattedHTML + '');
                ShowSection('#searchproductlistwrapper,#searchproductlist');
                $(".kvadraticzarobu").on("click", function (event) {
                    $(this).addClass('btn-danger').addClass('disabled').attr('disabled', 'disabled');
                    AddProductToDocument($(this).attr('robaid'));
                });

                $("#desktoploader,#desktoploader2").hide();

            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError);
            }
        });
        
    }

    // ============================================================================= DODAJ ROBU NA DOKUMENT ...

    function AddProductToDocument(robaid) {
            $("#desktoploader,#desktoploader2").show();
            $.ajax({
                url: strCrossDomainServiceURL + '?d=' + $("#d").html() + '&g=' + $("#g").html() + '&a=AddProductToDocument&robaid=' + robaid,
                dataType: 'jsonp',
                jsonp: 'jsoncallback',
                timeout: 10000,
                success: function (data, status) {
                    $("#desktoploader,#desktoploader2").hide();
                    GetDocumentItems();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(thrownError);
                }
            });
        }

    // ============================================================================= STAVKE DOKUMENTA  ...

    function GetDocumentItems() {
        var strFormattedHTML = '';
        $("#desktoploader,#desktoploader2").show();
        ShowSection('#documentitemslistwrapper');
        //$("#documentitemslist").fadeTo("fast", 0);
        $.ajax({
            url: strCrossDomainServiceURL + '?d=' + $("#d").html() + '&g=' + $("#g").html() + '&a=GetDocumentItems' ,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {

                var i5 = 0;
                $.each(data, function (i, item) {
                    i5 = i5 + 1;
                    strFormattedHTML = strFormattedHTML
                    + '<div class="span4   nekikvadratic" robaid="' + item.prometid + ' "><div class="Transparent">'
                    + 'PrometId : ' + item.prometid + '<br>'
                    + 'Količina : ' + item.prometid + ' '
                    + '<h4>' + item.Cijena1200 + 'kn</h3>' + ' '
                    + '<div class="btn-success btn-large">' + item.Roba5400 + '</div>'
                    + '</div></div>';
                    if (i5 == 3) { i5 = 0; strFormattedHTML = strFormattedHTML + '<div class="clearfix" ></div>' }
                });

                //$("#documentitemslist").fadeTo("fast", 1);
                $("#documentitemslist").html('' + strFormattedHTML + '');

                $("#desktoploader,#desktoploader2").hide();

                GetDocTotal();

            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError);
            }
        });

    }

    // ============================================================================= NACINI PLACANJA ...

    $(".naplata").click(function () {
        $("#desktoploader,#desktoploader2").show();
        var strFormattedHTML = '';
        var strPrviNacinPlacanja = '';
        var i5 = 1;
        ShowSection('#naplataitemslistwrapper');
        $.ajax({
            url: strCrossDomainServiceURL + '?d=' + $("#d").html() + '&g=' + $("#g").html() + '&a=GetNacinPlac',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {

                $.each(data, function (i, item) {
                    if (i5 == 1) { i5 = 0; strPrviNacinPlacanja = 'bsjDocTotal2';} else { strPrviNacinPlacanja = ''}
                    strFormattedHTML = strFormattedHTML
                    + '<div class="span4   nekikvadratic" id="' + item.SifraNacinPlac + ' "><div class="Transparent">'
                    + '<input type="number" class="input enterastab bsjPayTimeValues ' + strPrviNacinPlacanja + '" value="0" step="any"  tid="' + item.SifraNacinPlac + '" id="PayTime' + item.SifraNacinPlac + '"  name="PayTime' + item.SifraNacinPlac + '"  placeholder="iznos" >'
                    + '<div class="btn-warning btn-large">' + item.Naziv + '</div>'
                    + '</div></div>';
                });

                $("#naplataitemslist").html( strFormattedHTML );

                $("#btnspremiracun").show();

                $(".bsjPayTimeValues").on('change', function (event) {
                    if (isNaN(parseFloat(this.value))) return;
                    this.value = parseFloat(this.value).toFixed(2);
                    $(".bsjDocTotal2").val((parseFloat($("#bsjDocTotal6").val()).toFixed(2) - SUMbsjPayTimeValuesExceptFirst()).toFixed(2));
                    SUMbsjPayTimeValues();
                });

                $(".bsjPayTimeButton").on('click', function (event) {
                    $(".bsjPayTimeButton").removeClass('btn-danger');
                    $(this).addClass('btn-danger');
                    $(".bsjPayTimeValues").val(0);
                    $("#PayTime" + $(this).attr('tid')).val($("#bsjDocTotal6").val());
                    SUMbsjPayTimeValues();
                });
                
                $("#desktoploader,#desktoploader2").hide();

                GetDocTotal();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError);
            }
        });
    });
    
    // ============================================================================= DAJ TOTAL ...

    function GetDocTotal() {
        var strFormattedHTML = '';
        $("#doctotal1").hide();
        $("#doctotal1loader").show();
        $.ajax({
            url: strCrossDomainServiceURL + '?d=' + $("#d").html() + '&g=' + $("#g").html() + '&a=GetDocTotal',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {

                $.each(data, function (i, item) {
                     
                    $("#doctotal1").html('' + item.doctotal + 'kn');
                    $(".bsjDocTotal2,#bsjDocTotal6").val(item.doctotal);
                });

                $("#doctotal1loader").hide();
                $("#doctotal1").show('slow');

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError);
            }
        });
    };

    // ============================================================================= SUMIRANJA UNEŠENIH PLAĆANJA
 
    function SUMbsjPayTimeValuesExceptFirst() {
        var sum = 0;
        $(".bsjPayTimeValues").each(function () {
            var val = $(this).val();
            if ($(this).hasClass('bsjDocTotal2')) {

            } else {
                sum += parseFloat(('0' + val).replace(/[^0-9-\.]/g, ''), 10);
            }
        });
        return sum;
    }

    function SUMbsjPayTimeValues() {
        var sum = 0;
        $(".bsjPayTimeValues").each(function () {
            var val = $(this).val();
            sum += parseFloat(('0' + val).replace(/[^0-9-\.]/g, ''), 10);
        });
        $("#bsjDocTotalEntered").val(sum);
        return sum;
    }

    // ============================================================================= SAVE DOCUMENT ...

    $("#btnspremiracun").click(function () {
        SaveDoc();
    });

    function SaveDoc() {
        var strFormattedHTML = '';
        $("#desktoploader,#desktoploader2").show();
        $.ajax({
            url: strCrossDomainServiceURL + '?d=' + $("#d").html() + '&g=' + $("#g").html() + '&a=SaveDoc&' + $("#naplataitemsform").serialize(),
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {

                $.each(data, function (i, item) {
                    if (item.errnumber == '0') { $(".nastavidugmic").trigger('click') } else { alert(item.errdescription)}
                });

                $("#desktoploader,#desktoploader2").hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError);
            }
        });
    }

    // ============================================================================= KRAJ ...

    
    $(".pokaziopcijedokumenta").click(function () {
        ShowSection('.dugmicizaprodaju');  
    });

    $(".btnkraj").click(function () {
        //$("#doccursection").hide();
        //$(".dugmicizaprodaju").hide('slow');
        ShowSection('#krajsection');
    });

    $(".nastavidugmic,.pokazistavkedokumenta").click(function () {
        //$(".dugmiczaprodaju").show('slow');
        //$("#doccursection").show();
        $("#krajsection").hide();
        GetDocumentItems();
        $("#searchproductstext").focus();
    });

    $(".glavnimenidugmic").click(function () {
        //$(".dugmicizaprodaju").hide('slow');
        ShowSection('#glavnimeni');
    });

    // ============================================================================= SHOW ONE SECTION AND HIDE ALL OTHERS ...

    function ShowSection(sectionname) {
       // $("#doccursection").hide();
        $("#loginsection").hide();
        $("#commentsection").hide();
        $("#searchproductlist").hide();
        $("#documentitemslistwrapper").hide();
        $("#krajsection").hide();
        $("#glavnimeni").hide();
        $("#themelist").hide();
        $("#naplataitemslistwrapper").hide();
        $("#searchproductlistwrapper").hide();
        $("#btnspremiracun").hide();
        $(".dugmicizaprodaju").hide();
        $(sectionname).show();
        $("#searchproductstext").focus();
    }
   
    // ============================================================================= 


    $(".butonzakomentiranje").click(function () {
        //$("#doccursection").hide();
        //$(".dugmiczaprodaju").hide('slow');
        ShowSection('#commentsection');
    });
    



});                                           // end of document ready
   