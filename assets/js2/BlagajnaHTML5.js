﻿$(document).ready(function () {

    var POSType = ''; // N - samo narudžbe , blank je defoltni normalni POS
    var Fiskalizacija = 1; //  0-no , 1-yes
    var strCrossDomainServiceURL = 'http://www.spin.hr/ng/posservice/'; // ili moj lokalni:  http://192.168.68.148/BlagajnaHTML5/posservice/
    var strFiskalizacijaServiceURL = 'http://127.0.0.1/nekisite/'
    var stPicturesURL = 'http://127.0.0.1/BlagajnaHTML5/assets/pic/';
    var strDevice = '';
    var dataBase = '';
    var speeddialsection = 'A';
    var strFormattedHTMLzaKLASE = '';

    $(".mysection,.loadergif").hide();

    //$('.glavniizbornik').equalHeight();

    /*
    $('.slider').glide({
        autoplay: 5000,
        arrows: 'body',
        nav: 'body'
    });
    */

    //$('.carousel').carousel();

    if ($.Storage.get("BlagajnaHTML5w") != undefined) { $("#w").val($.Storage.get("BlagajnaHTML5w")) };
    if ($.Storage.get("BlagajnaHTML5g") != undefined) { $("#g").html($.Storage.get("BlagajnaHTML5g")) };
    if ($.Storage.get("BlagajnaHTML5e") != undefined) { $("#e").val($.Storage.get("BlagajnaHTML5e")) };
    if ($.Storage.get("BlagajnaHTML5p") != undefined) { $("#p").val($.Storage.get("BlagajnaHTML5p")) };
    if ($.Storage.get("BlagajnaHTML5d") != undefined) { $("#d").val($.Storage.get("BlagajnaHTML5d")) };
    if ($.Storage.get("BlagajnaHTML5o") != undefined) { $("#o").val($.Storage.get("BlagajnaHTML5o")) };
    if ($.Storage.get("BlagajnaHTML5langid") != undefined) { $("#langid").attr("data-langid", $.Storage.get("BlagajnaHTML5langid")) };
    if ($.Storage.get("BlagajnaHTML5langcaption") != undefined) { $("#langid").html($.Storage.get("BlagajnaHTML5langcaption")) };

    $("input[type=text]").focus(function() { $(this).select(); });
    $("input[type=text]").mouseup(function (e) { e.preventDefault(); });

    $('a[href="#"]').click(function (e) { e.preventDefault(); });
 
    $(".printdoc").on('click', function () { window.print(); return false; });
    $("#settingsbutton").on('click', function () { $("#settingssection").toggle(''); $("#settingsbutton").hide('slow'); });
    $(".readmoreaboutdugmic").on('click', function () { $("#readmoreabout").toggle(''); $(".readmoreaboutdugmic").hide('slow'); });
    

    $('form').submit(function (e) { e.preventDefault(); return false; });

    $('#searchproductstext').on("keypress", function (e) {
        if (e.keyCode == 13) {
            $('#searchproductsbutton').trigger('click');
            return false;
        }
    });

    //    ================================================================= language

    Translate();

    $(".langselector").on('click', function () {
        $("#langid").html($(this).html());
        $.Storage.set({ "BlagajnaHTML5langid": $(this).attr("data-langid") });
        $("#langid").attr("data-langid", $(this).attr("data-langid"));
        $.Storage.set({ "BlagajnaHTML5langcaption": $(this).html() });
        Translate();
    });

    function Translate() {
        $(".translateable").each(function () {
            $(this).html($(this).attr("data-" + $("#langid").attr("data-langid")));
        });
        }
    

    //Login();

    //    ================================================================= theme

    var bgindex = "2.jpg";
    if ($.Storage.get("BlagajnaHTML5bgindex") != undefined) { bgindex = $.Storage.get("BlagajnaHTML5bgindex") };
    $.backstretch("assets/css/bg/" + bgindex);
    
    $('.backstretch').addClass('hidden-print');
    $('img[data-id="' + bgindex + '"]').removeClass('img-rounded').addClass('img-thumbnail2').css('opacity','1');

    $('.themeimg img,#themeblank,#themeblank2,#themeblank3').click(function () {
        bgindex = $(this).attr('data-id');
        if (bgindex == '0.png') { $('.backstretch').remove(); } else { $.backstretch("assets/css/bg/" + bgindex); }
        $.Storage.set({ "BlagajnaHTML5bgindex": bgindex });
        $.Storage.set({ "BlagajnaHTML5AdditionalCSS": $(this).attr('data-css') });
        $("link.additional").attr("href", $(this).attr('data-css'));
        $('.themeimg img').removeClass('img-thumbnail2').addClass('img-rounded').css('opacity', '0.3');
        $('img[data-id="' + bgindex + '"]').removeClass('img-rounded').addClass('img-thumbnail2').css('opacity', '1');
    });

    $('#themeblank3').click(function () {
        $('.navbar').removeClass('navbar-inverse');
    });

    $('.themeimg img,#themeblank,#themeblank2').click(function () {
        $('.navbar').addClass('navbar-inverse');
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
        ShowSection('#themelist');
    });
    
    function GetMessages() {
        return
    }

    //    ================================================================= login
    $("#loginbutton").click(function () {
        Login();
    });

    function Login() {
        $(".errordescription").html('');
        $("#loginbutton").addClass('disabled').attr('disabled', 'disabled');
        $("#loginloadergif").show();
        strDevice = $("#o").val();
        if ($("#w").val() != '') { strCrossDomainServiceURL = $("#w").val(); }
        $.ajax({
            url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&a=login&e=' + $("#e").val() + '&p=' + $("#p").val(),
            type: 'POST',
            cache: false,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            async: true,
            contentType: "application/json;charset=UTF-8",
            success: function (data, status) {
                $("#g").html(data.userguid);
                if (data.errnumber != '0') {
                    $(".errordescription").html(data.errdescription);
                }
                if (data.userguid != '0') {
                    dataBase = data.database;
                    // $("#usernamenav").html(dataBase + "|" + data.username);
                    $(".navbar-brand").hide();
                    $("#dugmicinafixnomhederu").show('');
                    $("#usernamenav").html(data.username);
                    $("#d2").html($("#d").val());
                    $.Storage.set({ "BlagajnaHTML5w": $("#w").val() });
                    $.Storage.set({ "BlagajnaHTML5g": $("#g").html() });
                    $.Storage.set({ "BlagajnaHTML5e": $("#e").val() });
                    $.Storage.set({ "BlagajnaHTML5p": $("#p").val() });
                    $.Storage.set({ "BlagajnaHTML5d": $("#d").val() });
                    $.Storage.set({ "BlagajnaHTML5o": $("#o").val() });
                    if ($.Storage.get("AtabCaption") != undefined) { $("#AtabCaption").html("<span  class='glyphicon glyphicon-search'></span> " + $.Storage.get("AtabCaption")) };
                    if ($.Storage.get("BtabCaption") != undefined) { $("#BtabCaption").html("<span  class='glyphicon glyphicon-search'></span> " + $.Storage.get("BtabCaption")) };
                    if ($.Storage.get("CtabCaption") != undefined) { $("#CtabCaption").html("<span  class='glyphicon glyphicon-search'></span> " + $.Storage.get("CtabCaption")) };
                    if ($.Storage.get("DtabCaption") != undefined) { $("#DtabCaption").html("<span  class='glyphicon glyphicon-search'></span> " + $.Storage.get("DtabCaption")) };
                    $("#loginsection,#btnspremiracun").hide();
                    $("#doccursection").show('slow');
                    //GetDocumentItems();
                    GetKlase();
                    GetDocTotal();
                    GetSearchProductsList(0);
                    GetStolovi();
                } else
                { $("#loginbutton").removeClass('disabled').removeAttr('disabled', 'disabled'); }
                $("#loginloadergif").hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert('Login error !');
                $(".errordescription").html('Login error !');
                $("#loginbutton").removeClass('disabled').removeAttr('disabled', 'disabled');
                $("#loginloadergif").hide();
            }
        });
    }

    // logout ...
    $(".logoutdugmic").on('click', function () { $("#dugmicinafixnomhederu").hide(''); $(".navbar-brand").show(''); ShowSection('#loginsection'); $("#loginbutton").removeClass('disabled').removeAttr('disabled', 'disabled'); });

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

    // ============================================================================= DAJ KLASE ... ovo se zove samo jednom 

    function GetKlase() {
        strFormattedHTMLzaKLASE = '';
        $.ajax({
            url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=GetKlase',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                
                var i5 = 0;
                var c5 = 0;
                strFormattedHTMLzaKLASE = strFormattedHTMLzaKLASE
                   + '<div class="col-sm-3 mojakolona klasa" naziv="<span class=translateable data-hr=Favoriti data-en=Favorites > Favoriti</span>" MPKLasaKasaID="-1">'
                   + '<div class="Transparent kvadraticzarobu">'
                   + '<div class="btn-lg"><span class="label label-danger"><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span></span> <span class="translateable" data-hr="Favoriti" data-en="Favorites" > Favoriti</span></div>'
                   + '</div>'
                   + '</div>'
                   + '<div class="col-sm-3 mojakolona klasa" MPKLasaKasaID="-2">'
                   + '<div class="Transparent kvadraticzarobu">'
                   + '<div class="btn-lg"><span class="label label-danger"><span class="glyphicon glyphicon-fire"></span><span class="glyphicon glyphicon-fire"></span></span> <span class="translateable" data-hr="Najčešći" data-en="Frequent" > Najčešći</span></div>'
                   + '</div>'
                   + '</div>'
                   + '<div class="col-sm-3 mojakolona klasa" MPKLasaKasaID="-3">'
                   + '<div class="Transparent kvadraticzarobu">'
                   + '<div class="btn-lg"><span class="label label-danger"><span class="glyphicon glyphicon-flash"></span><span class="glyphicon glyphicon-flash"></span></span> <span class="translateable" data-hr="Zadnji" data-en="Latest" > Zadnji</span></div>'
                   + '</div>'
                   + '</div>'
                   + '<div class="col-sm-3 mojakolona klasa" MPKLasaKasaID="-4">'
                   + '<div class="Transparent kvadraticzarobu">'
                   + '<div class="btn-lg"><span class="label label-danger"><span class="glyphicon glyphicon-gift"></span><span class="glyphicon glyphicon-gift"></span></span> <span class="translateable" data-hr="Akcija" data-en="On sale" > Akcija</span></div>'
                   + '</div>'
                   + '</div>'
                   + '<div class="clearfix" ></div>';

                $.each(data, function (i, item) {
                    i5 = i5 + 1;
                    c5 = c5 + 1;
                    strFormattedHTMLzaKLASE = strFormattedHTMLzaKLASE
                    + '<div class="col-sm-3 mojakolona klasa" naziv="' + item.naziv + '" MPKLasaKasaID="' + item.MPKLasaKasaID + ' ">' 
                    + '<div class="Transparent kvadraticzarobu">'
                    + '<div class="btn-lg"><span class="label label-danger">' + c5 + ' <span class="glyphicon glyphicon-stop"></span></span> ' + item.naziv + '</div>'
                    + '</div></div>';
                    if (i5 == 4) { i5 = 0; strFormattedHTMLzaKLASE = strFormattedHTMLzaKLASE + '<div class="clearfix" ></div>' }
                });

                $("#searchproductsbutton").trigger('click'); // odmah pokaži klase u prvom tabu
               
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError);
            }
        });
    }

    // ============================================================================= TRAŽILICA ROBE ...

    $(".afterclickfocussearchproductstext").click(function () { 
        //$("#searchproductstext").focus();  
    });

    $("#searchproductsbutton").click(function () { // CLICK NA CRVENO SEARCH DUGME - ako nije ništa unešeno u tražilicu prikazujem klase robe
        if ($("#searchproductstext").val() == '') { 
            $("#searchproductlist" + speeddialsection).html(strFormattedHTMLzaKLASE);
            $("#" + speeddialsection + "tabCaption").html("<span class='label label-danger'><span  class='glyphicon glyphicon-stop'></span></span> ");
            $(".klasa").off();
            $(".klasa").on("click", function (event) {
                GetSearchProductsList($(this).attr('MPKLasaKasaID'));
                $("#" + speeddialsection + "tabCaption").html("<span class='label label-danger'><span  class='glyphicon glyphicon-stop'></span></span> " + $(this).attr('naziv'));
            });
            Translate();
        };
        GetSearchProductsList(0);
        $("#searchproductsbutton").fadeOut().fadeIn();
    });

    $("#searchproductstext").click(function () { GetSearchProductsList(0); });
    $("#speeddialsection li a").click(function () {
        speeddialsection = $(this).attr('data-tag');
        if ($("#searchproductlist" + speeddialsection).text() == '') { $("#searchproductstext").val($(this).text()); GetSearchProductsList(0); }
    });

    function GetSearchProductsList(klasaid) {
        var strFormattedHTML = '';
        var speeddialsectioncookie = 'A';
        ShowSection('#speeddial');
        if (($("#searchproductstext").val() != '') || (klasaid != 0)) {
            $("#searchproductlist" + speeddialsection).html('');
            $("#speeddialloader").show();
            $.ajax({
                url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=GetSearchProductsList&klasaid=' + klasaid  + '&s=' + $.trim($("#searchproductstext").val()),
                dataType: 'jsonp',
                jsonp: 'jsoncallback',
                timeout: 10000,
                success: function (data, status) {
                    if (klasaid==0) { $("#" + speeddialsection + "tabCaption").html("<span  class='glyphicon glyphicon-search'></span> " + $("#searchproductstext").val()); }
                    speeddialsectioncookie = speeddialsection + "tabCaption";
                    $.Storage.set(speeddialsectioncookie , $("#searchproductstext").val());
                    $("#searchproductstext").val('');
                    var i5 = 0;
                    var rrr = '';
                    var prefixrrr = '';
                    var strmojfavorit = '';
                    $.each(data, function (i, item) {
                        i5 = i5 + 1;
                        if (item.mojfavorit == 0) { strmojfavorit = '-empty ' } else { strmojfavorit = ' text-danger' }
                        if (item.kolicina != 0)
                        { prefixrrr = ''; rrr = '<span class="label label-success"><span class="glyphicon glyphicon-shopping-cart"></span> x ' + item.kolicina + ' = ' + item.iznos + '</span>' }
                        else
                        {
                            prefixrrr = '';
                            rrr = '<span class="glyphicon glyphicon-shopping-cart text-muted"></span>';
                        }
                        strFormattedHTML = strFormattedHTML
                        + '<div class="clearfix col-sm-3  mojakolona"><div class=" Transparent  kvadraticzarobu" robaid="' + item.robaid + '" >'
                        + '<span class="   col-xs-10 mojakolona clearfix   kvadraticzarobu' + speeddialsection + ' ">'
                        + '<h4><span class="label label-primary">' + item.mpcijena + 'kn</span> ' + ' '
                        + ' ' + prefixrrr + '<span class="rrr rrr' + item.robaid + '" >' + rrr + '</span></h4>'
                        + ' ' + item.naziv + ' '
                        + '</span>'
                        + '<span class=" col-xs-2 mojakolona">'
                        + '<div class="clearfix" />'
                        + '<span class="text-muted pull-right mojfavorit' + speeddialsection + '"  data-id="' + item.robaid + '" ><h4><span class="fav1tip' + item.robaid + ' glyphicon glyphicon-star' + strmojfavorit + '"></span></h4> </span>'
                        + '</span>'
                        + '</div></div>';
                        if (i5 == 4) { i5 = 0; strFormattedHTML = strFormattedHTML + '<div class="clearfix" ></div>' }
                    });
                    $("#searchproductlist" + speeddialsection).html('' + strFormattedHTML + '');
                    $(".kvadraticzarobu" + speeddialsection).on("click", function (event) {
                        // $(this).addClass('btn-danger').addClass('disabled').attr('disabled', 'disabled');
                        AddProductToDocument($(this).parent().attr('robaid'));
                        $(this).fadeOut('fast').fadeIn('fast');
                    });

                    $(".mojfavorit" + speeddialsection).on("click", function (event) {
                        BookMarkIt(1,$(this).attr('data-id'));
                    });

                    $("#speeddialloader").hide();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(thrownError);
                    $("#speeddialloader").hide();
                }
            });
        }
    }

    // ============================================================================= BOOKMARKS ...

    function BookMarkIt(tip,id) {
        $.ajax({
            url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=BookMarkIt&id=' + id + '&tip=' + tip,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                $.each(data, function (i, item) {
                    if (item.bookmarkcount == '0') {
                        $(".fav1tip" + id).removeClass('glyphicon-star').removeClass('text-danger').addClass('glyphicon-star-empty');
                    } else {
                        $(".fav1tip" + id).removeClass('glyphicon-star-empty').addClass('glyphicon-star').addClass('text-danger');
                    }
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError);
            }
        });
    }

    // ============================================================================= DODAJ ROBU NA DOKUMENT ...

    function AddProductToDocument(robaid) {
            $("#docitemsloader").show();
            $.ajax({
                url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=AddProductToDocument&robaid=' + robaid,
                dataType: 'jsonp',
                jsonp: 'jsoncallback',
                timeout: 10000,
                success: function (data, status) {
                    $("#docitemsloader").hide();
                    //GetDocumentItems();
                    GetDocTotal();

                    $.each(data, function (i, item) {
                        if (item.errnumber == '0') {
                            $(".rrr" + robaid).html('<span class="label label-success"><span class="glyphicon glyphicon-shopping-cart"></span> x ' + item.kolicina + ' = ' + item.iznos + '</span>');
                        } else {
                            $(".errordescription").html(item.errdescription);
                        }
                    });

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(thrownError);
                }
            });
        }

    // ============================================================================= STAVKE DOKUMENTA  ...

    function GetDocumentItems() {
        var strFormattedHTML = '';
        $("#documentitemslist").html('');
        $("#docitemsloader").show();
        $(".pokazistavkedokumenta").fadeOut().fadeIn();
        ShowSection('#documentitemslistwrapper');
        $.ajax({
            url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=GetDocumentItems',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                var i5 = 0;
                var c5 = 0;
                var strnapomenastavke = '';
                $.each(data, function (i, item) {
                    i5 = i5 + 1;
                    c5 = c5 + 1;
                    strnapomenastavke = '';
                    if (item.napomenastavke != '') { strnapomenastavke = '<span class="glyphicon glyphicon-comment"></span> ' + item.napomenastavke + ''; }
                    strFormattedHTML = strFormattedHTML
                    + '<div class="col-sm-3  mojakolona" naziv="' + item.Roba5400 + '" prometid="' + item.prometid + '" ><div class="Transparent kvadraticzastavke ">'
                    
                    + '<span class=" col-xs-11 mojakolona">'
                    + '<h4>'
                    + ' <span class="label label-success">'
                    + item.Cijena1200 + 'kn '
                    + ' x  ' + item.Količina1000 + ' = ' + item.Iznos1400
                    + '</span></h4>' + ' '
                    + '<span class="text text-muted"><strong>' + c5 + '.</strong></span> ' + item.Roba5400 + ' ' + strnapomenastavke + ' '
                    + '</span>'
                    + '<span  class=" col-xs-1 mojakolona">'
                    + '<h4><span class="text-muted pull-right" ><span class="glyphicon glyphicon-chevron-right"></span></span></h4>'
                    
                    + '</span>'
                    + '</div></div>';
                    if (i5 == 4) { i5 = 0; strFormattedHTML = strFormattedHTML + '<div class="clearfix" ></div>' }
                });
                $("#documentitemslist").html('' + strFormattedHTML + '');
                $("#docitemsloader").hide();
                $(".kvadraticzastavke").on("click", function (event) {
                   // $(this).addClass('btn-success').addClass('disabled').attr('disabled', 'disabled');
                    ShowDocItem($(this).parent().attr('prometid'));
                    $(".uklonistavku").attr('tid', $(this).parent().attr('prometid'));
                    $("#detaljno").html( $(this).parent().attr('naziv'));
                });
                GetDocTotal();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError);
            }
        });
    }


    // kao i ovo gore samo formatiram kao tablicu
    function GetDocumentItemsTablica() {
        var strFormattedHTML = '';
        $.ajax({
            url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=GetDocumentItems',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                $.each(data, function (i, item) {
                    strFormattedHTML = strFormattedHTML
                    + '<tr><td>' + item.Roba5400 + '</td><td>' + item.Količina1000 + '</td><td>' + item.Cijena1200 + '</td></tr>'
                });

                strFormattedHTML = '<table class="table Transparent"><thead><tr><th>Naziv</th><th>Količina</th><th>Cijena</th></tr></thead><tbody>' + strFormattedHTML + '</tbody></table>'

                $("#pregledstolalist").html(strFormattedHTML);

                $("#pregledstolovaloader").hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError);
            }
        });
    }
    
    // ================================================================================= UKLONI STAVKU ...

    $(".uklonistavku").click(function () {
        DelItem($(this).attr('tid'));
    });

    function DelItem(tid) {
        $.ajax({
            url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=DelItem&id=' + tid,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                GetDocumentItems();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError);
            }
        });
    }

    // ================================================================================= PREGLED NARUCENOG PO STOLOVIMA ...

    $(".pregledstolovadugmic").click(function () {
        GetStoloviNarudzbe();
    });

    function GetStoloviNarudzbe() {
        $("#pregledstolovalist").html('');
        ShowSection('#pregledstolovasection');
        $("#pregledstolovaloader").show();
        var strFormattedHTML = '';
        var curStol = '';
        var curTotal = 0;
        var curTotalTotal = 0;
        $.ajax({
            url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=GetStoloviNarudzbe',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                $.each(data, function (i, item) {
                    curTotalTotal = curTotalTotal + (item.Kolicina * item.MPCijena);
                    if (curStol != item.Stol) {
                        if (curTotal != 0) { strFormattedHTML = strFormattedHTML + '<tr><td></td><td colspan="2"><h3><span class="label label-primary pull-right"> = ' + curTotal + '</span></h3></td></tr>'; }
                        strFormattedHTML = strFormattedHTML + '<tr><td colspan="3"><h2><span class="label label-danger">Stol ' + item.Stol + '</span></h2></td></tr>';
                        curTotal = 0;
                    }
                    curTotal = curTotal + (item.Kolicina * item.MPCijena)

                    strFormattedHTML = strFormattedHTML
                    + '<tr><td>' + item.Roba + '</td><td>' + item.Kolicina + '</td><td>' + item.MPCijena + '</td></tr>'
                    curStol = item.Stol;
                });

                strFormattedHTML = strFormattedHTML + '<tr><td colspan="2"></td><td colspan="2"><h3><span class="label label-primary pull-right"> = ' + curTotal + '</span></h3></td></tr>';
                strFormattedHTML = '<table class="table"><thead><tr><th>Naziv</th><th>Količina</th><th>Cijena</th></tr></thead><tbody>' + strFormattedHTML + '</tbody></table>'

                strFormattedHTML = strFormattedHTML + '<br /><br /><h3><span class="label label-primary pull-right">Ukupno nenaplaćeno: ' + curTotalTotal + '</span></h3>'
                
                $("#pregledstolovalist").html(strFormattedHTML);
                $("#pregledstolovaloader").hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError);
            }
        });
    }


    // ============================================================================= STOLOVI ...

    function GetStolovi() {
        var strFormattedHTML = '';
        $.ajax({
            url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=GetStolovi',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                 $.each(data, function (i, item) {
                    strFormattedHTML = strFormattedHTML
                    + '<div class="col-sm-4 mojakolona " id="' + item.mpstoloviid + ' "><div class="Transparent kvadraticzarobu">'
                    + '<div class="btn-lg btnStol" brojstola="' + item.broj + '" >' + '<span class="label label-danger"><span class="glyphicon glyphicon-th-large"></span></span> [' + item.broj + '] ' + item.opis + '</div>'
                    + '</div></div>';
                 });

                $("#stolovilist").html(strFormattedHTML);
                $(".btnStol").off();
                $(".btnStol").on('click', function (event) {
                    $(".btnStol").removeClass('btn-danger');
                    $(this).addClass('btn-danger');
                    $.Storage.set({ "brojstola": $(this).attr('brojstola') });
                    $("#brojstola,.brojstola").html($(this).attr('brojstola'));
                    //$(".naplata").trigger('click');
                    ZakljuciDoc();
                });
               
               //  if ($.Storage.get("brojstola") != undefined) { $("#brojstola,.brojstola").html($.Storage.get("brojstola")); $(".btnStol[brojstola='" + $.Storage.get("brojstola") + "']").addClass('btn-danger'); } else { $("#brojstola,.brojstola").html('1'); $(".btnStol[brojstola='1']").addClass('btn-danger'); };

            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError);
            }
        });
    } 

    // ============================================================================= NACINI PLACANJA ...

    $(".naplata").click(function () {
        ZakljuciDoc();
    });

    function ZakljuciDoc() {
        if ($("#brojstola").html() == '') { $(".pokaziopcijedokumenta").trigger('click'); return; } // ako stol nije izabran idemo ga izabarati
        $("#pregledstolalist").html('');
        $("#documentcommentviewer").html($("#documentcomment").val());
        ShowSection('#naplataitemslistwrapper');
        if (POSType == 'N') { $("#naplataitemslist").hide(); GetDocumentItemsTablica(); }
        $(".naplata").fadeOut().fadeIn();
        var strFormattedHTML = '';
        var strPrviNacinPlacanja = '';
        var i5 = 1;

        if ($("#naplataitemslist").html() == '') { // samo jednom zovem ...
            $("#naplataloader").show();
            $.ajax({
                url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=GetNacinPlac',
                dataType: 'jsonp',
                jsonp: 'jsoncallback',
                timeout: 10000,
                success: function (data, status) {
                    var i6 = 0;
                    $.each(data, function (i, item) {
                        if (i5 == 1) { i5 = 0; strPrviNacinPlacanja = 'bsjDocTotal2'; } else { strPrviNacinPlacanja = '' }
                        i6 = i6 + 1;
                        strFormattedHTML = strFormattedHTML
                        + '<div class="col-sm-4 mojakolona" id="' + item.SifraNacinPlac + ' "><div class="Transparent kvadraticzarobu">'
                        + '<input type="number" class="form-control input-lg enterastab bsjPayTimeValues ' + strPrviNacinPlacanja + '" value="0" step="any"  tid="' + item.SifraNacinPlac + '" id="PayTime' + item.SifraNacinPlac + '"  name="PayTime' + item.SifraNacinPlac + '"  placeholder="iznos" >'
                        + '<div class="btn-primary btn-lg">' + item.Naziv + '</div>'
                        + '</div></div>';
                        if (i6 == 3) { i6 = 0; strFormattedHTML = strFormattedHTML + '<div class="clearfix" ></div>' }
                    });
                    $("#naplataitemslist").html(strFormattedHTML);
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
                    $("#naplataloader").hide();
                    GetDocTotal();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(thrownError);
                }
            });
        } else { $("#btnspremiracun").show(); GetDocTotal(); }
    }
    
    // ============================================================================= DAJ TOTAL ...

    function GetDocTotal() {
        var strFormattedHTML = '';
        $("#doctotal1").hide();
        $("#doctotal1loader").show();
        $.ajax({
            url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=GetDocTotal',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                $.each(data, function (i, item) {
                    $("#doctotal1").html('' + item.doctotal + '<span class="hidden-phone"></span>');
                    $(".bsjDocTotal2,#bsjDocTotal6").val(item.doctotal);
                    $(".bsjDocTotal3").html(item.doctotal);
                    $(".brojstavki,#brojstavki").html(item.brojstavki);
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

    $(".btnspremiracun").click(function () {
            SaveDoc();
    });

    function SaveDoc() {
        var strFormattedHTML = '';
        $("#desktoploader,#desktoploader2").show();
        $.ajax({
            url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=SaveDoc&POSType=' + POSType + '&brojstola=' + $("#brojstola").html() + '&' + $("#naplataitemsform").serialize(),
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                $.each(data, function (i, item) {
                    if (item.errnumber == '0') {
                        // $(".nastavidugmic").trigger('click')

                            if (Fiskalizacija = 1) {
                                Fiskaliziraj();
                            }
                            else {
                                // clear DOM = new document
                                ClearDOM();
                            }

                    } else {
                        // $(".errordescription").html(item.errdescription);
                        alert(item.errdescription);
                    }
                });
                
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError);
            }
        });
    }

    // ============================================================================= CLEAR DOM ...
    function ClearDOM() {
        $("#brojstola").html('');
        $(".rrr").html('<span class="glyphicon glyphicon-shopping-cart text-muted"></span>');
        $("#desktoploader,#desktoploader2").hide();
        $("#pregledstolalist").html('');
        GetDocTotal();
        GetSearchProductsList(0);
    }

    // ============================================================================= FISKALIZACIJA ...

    function Fiskaliziraj() {
        var strFormattedHTML = '';
        $.ajax({
            url: strFiskalizacijaServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=fiskaliziraj&broj=000012&godina=2014',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                $.each(data, function (i, item) {
                    if (item.errnumber == '0') {
                        alert(item.errdescription);
                    }
                    else { alert(item.errdescription); }
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError);
            }
        });
    }

    // ============================================================================= CANCEL DOCUMENT ...

    $(".canceldoc").click(function () {
        ShowSection('.canceldocsection');
    });

    $(".reallycanceldoc").click(function () {
        CancelDoc();
    });

    function CancelDoc() {
        var strFormattedHTML = '';
        $("#desktoploader,#desktoploader2").show();
        $.ajax({
            url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=CancelDoc',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                $("#desktoploader,#desktoploader2").hide();
                //GetDocumentItems();
                GetDocTotal();
                GetSearchProductsList(0);
                $(".rrr").html('<span class="glyphicon glyphicon-shopping-cart text-muted"></span>');
                $("#brojstola").html('');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError);
            }
        });
    }

    // ============================================================================= GET DOC ITEM  ...
    function ShowDocItem(id) {
        ShowSection('.docitemsection');
        $("#kolicina").attr('data-id',id);
        $("#saveqtyloader").show();
        $.ajax({
            url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=GetDocumentItem&id=' + id,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                $("#saveqtyloader").hide();
                $.each(data, function (i, item) {
                    $("#kolicina").val(item.Kolicina);
                    $("#napomenastavke").val(item.napomenastavke);
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError);
            }
        });
    }

    // ============================================================================= SPREMI KOLICINU ...

    $(".spremikolicinu").click(function () {
        SpremiKolicinu();
    });

    $("#pluskolicina").click(function () {
        $("#kolicina").val(parseInt($("#kolicina").val()) + 1);
    });

    $("#minuskolicina").click(function () {
        $("#kolicina").val(parseInt($("#kolicina").val()) - 1);
    });

   function SpremiKolicinu() {
        var strFormattedHTML = '';
        $("#saveqtyloader").show();
        $.ajax({
            url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=SaveQty&id=' + $("#kolicina").attr('data-id') + '&qty=' + $("#kolicina").val() + '&napomenastavke=' + $("#napomenastavke").val() + '&popust=' + $("#popust").val(),
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                $("#saveqtyloader").hide();
                GetDocumentItems();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError);
            }
        });
    }
    // ============================================================================= DAJ PARTNERE

   function GetPartners() {
       strFormattedHTML = '';
       $.ajax({
           url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=GetPartners',
           dataType: 'jsonp',
           jsonp: 'jsoncallback',
           timeout: 10000,
           success: function (data, status) {
               var i5 = 0;
               var c5 = 0;
               $.each(data, function (i, item) {
                   i5 = i5 + 1;
                   c5 = c5 + 1;
                   strFormattedHTML = strFormattedHTML
                   + '<div class="col-sm-3 mojakolona klasa" naziv="' + item.naziv + '" data.id="' + item.id + ' ">'
                   + '<div class="Transparent kvadraticzarobu">'
                   + '<div class="btn-lg"><span class="label label-danger">' + c5 + ' <span class="glyphicon glyphicon-stop"></span></span> ' + item.naziv + '</div>'
                   + '</div></div>';
                   if (i5 == 4) { i5 = 0; strFormattedHTML = strFormattedHTML + '<div class="clearfix" ></div>' }
               });
           },
           error: function (xhr, ajaxOptions, thrownError) {
               //alert(thrownError);
           }
       });
   }

    // ============================================================================= KRAJ ...
    
    $(".pokaziopcijedokumenta").click(function () {
        ShowSection('.dugmicizaprodaju');
        // $(".pokaziopcijedokumenta").fadeOut().fadeIn();
    });

    $(".btnkraj").click(function () {
        ShowSection('#krajsection');
    });

    $(".nastavidugmic,.pokazistavkedokumenta,#pregledstolalist").click(function () {
        $("#krajsection").hide();
        GetDocumentItems();
        //$("#searchproductstext").focus();
    });

    $(".glavnimenidugmic").click(function () {
        ShowSection('#glavnimeni');
        $(".glavnimenidugmic").fadeOut().fadeIn();
    });

    $(".butonzapartnera").click(function () {
        ShowSection('#partnerisection');
        $(".glavnimenidugmic").fadeOut().fadeIn();
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
        $(".canceldocsection").hide();
        $(".docitemsection").hide();
        $("#speeddial").hide();
        $("#pregledstolovasection").hide();
        $("#partnerisection").hide();
        $(sectionname).show();
       // $("#searchproductstext").focus();
    }
   
    // ============================================================================= 

    $(".butonzakomentiranje").click(function () {
        ShowSection('#commentsection');
    });

});                                           // end of document ready
   