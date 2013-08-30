$(document).ready(function () {

    var POSType = 'N'; // N - samo narudžbe , blank je defoltni normalni POS
    var strCrossDomainServiceURL = 'http://www.spin.hr/ng/posservice/'; // ili moj lokalni:  http://192.168.68.148/BlagajnaHTML5/posservice/
    var stPicturesURL = 'http://127.0.0.1/BlagajnaHTML5/assets/pic/';
    var strDevice = '';
    var dataBase = '';
    var speeddialsection = 'A';
    var strFormattedHTMLzaKLASE = '';

    $(".mysection,.loadergif").hide();

    //$('.carousel').carousel();

    if ($.Storage.get("BlagajnaHTML5w") != undefined) { $("#w").val($.Storage.get("BlagajnaHTML5w")) };
    if ($.Storage.get("BlagajnaHTML5g") != undefined) { $("#g").html($.Storage.get("BlagajnaHTML5g")) };
    if ($.Storage.get("BlagajnaHTML5e") != undefined) { $("#e").val($.Storage.get("BlagajnaHTML5e")) };
    if ($.Storage.get("BlagajnaHTML5p") != undefined) { $("#p").val($.Storage.get("BlagajnaHTML5p")) };
    if ($.Storage.get("BlagajnaHTML5d") != undefined) { $("#d").val($.Storage.get("BlagajnaHTML5d")) };
    if ($.Storage.get("BlagajnaHTML5o") != undefined) { $("#o").val($.Storage.get("BlagajnaHTML5o")) };

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

    Login();

    //    ================================================================= theme

    var bgindex = "2.jpg";
    if ($.Storage.get("BlagajnaHTML5bgindex") != undefined) { bgindex = $.Storage.get("BlagajnaHTML5bgindex") };
    $.backstretch("assets/css/bg/" + bgindex);
    $('img[data-id="' + bgindex + '"]').removeClass('img-rounded').addClass('img-thumbnail2').css('opacity','1');

    $('.themeimg img,#themeblank').click(function () {
        bgindex = $(this).attr('data-id');
        if (bgindex == '0.png') { $('.backstretch').remove(); } else { $.backstretch("assets/css/bg/" + bgindex); }
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
                $.each(data, function (i, item) {
                    i5 = i5 + 1;
                    strFormattedHTMLzaKLASE = strFormattedHTMLzaKLASE
                    + '<div class="col-sm-3  mojakolona klasa" MPKLasaKasaID="' + item.MPKLasaKasaID + ' "><div class="Transparent kvadraticzarobu">'
                    + '<div class="btn-primary btn-lg">' + item.naziv + '</div>'
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
            $("#" + speeddialsection + "tabCaption").html("<span  class='glyphicon glyphicon-stop'></span> KLASE");
            $(".klasa").off();
            $(".klasa").on("click", function (event) {
                GetSearchProductsList($(this).attr('MPKLasaKasaID'));
            });
        };
        GetSearchProductsList(0);
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
                url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=GetSearchProductsList&klasaid=' + klasaid  + '&s=' + $("#searchproductstext").val(),
                dataType: 'jsonp',
                jsonp: 'jsoncallback',
                timeout: 10000,
                success: function (data, status) {
                    $("#" + speeddialsection + "tabCaption").html("<span  class='glyphicon glyphicon-search'></span> " + $("#searchproductstext").val());
                    speeddialsectioncookie = speeddialsection + "tabCaption";
                    $.Storage.set(speeddialsectioncookie , $("#searchproductstext").val());
                    $("#searchproductstext").val('');
                    var i5 = 0;
                    $.each(data, function (i, item) {
                        i5 = i5 + 1;
                        strFormattedHTML = strFormattedHTML
                        + '<div class="col-sm-3  mojakolona " robaid="' + item.robaid + ' "><div class="Transparent kvadraticzarobu kvadraticzarobu' + speeddialsection + '">'
                        + '<h4>' + item.mpcijena + 'kn</h3>' + ' '
                        + '<div class="btn-danger btn-lg">' + item.naziv + '</div>'
                        //+ 'Userid : ' + item.userid + ' '
                        // + '<br />Barcode : ' + item.barcode + ' '
                        + '</div></div>';
                        if (i5 == 4) { i5 = 0; strFormattedHTML = strFormattedHTML + '<div class="clearfix" ></div>' }
                    });
                    $("#searchproductlist" + speeddialsection).html('' + strFormattedHTML + '');
                    $(".kvadraticzarobu" + speeddialsection).on("click", function (event) {
                        // $(this).addClass('btn-danger').addClass('disabled').attr('disabled', 'disabled');
                        AddProductToDocument($(this).parent().attr('robaid'));
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
        ShowSection('#documentitemslistwrapper');
        $.ajax({
            url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=GetDocumentItems',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                var i5 = 0;
                $.each(data, function (i, item) {
                    i5 = i5 + 1;
                    strFormattedHTML = strFormattedHTML
                    + '<div class="col-sm-3  mojakolona" naziv="' + item.Roba5400 + '" prometid="' + item.prometid + '" ><div class="Transparent kvadraticzastavke">'
                    + '<h5>'
                    + item.Cijena1200 + 'kn '
                    + ' x  ' + item.Količina1000 + ' = ' + item.Iznos1400
                    + '</h5>' + ' '
                    + '<div class="btn-success btn-lg">' + item.Roba5400 + '</div>'
                    + '</div></div>';
                    if (i5 == 4) { i5 = 0; strFormattedHTML = strFormattedHTML + '<div class="clearfix" ></div>' }
                });
                $("#documentitemslist").html('' + strFormattedHTML + '');
                $("#docitemsloader").hide();
                $(".kvadraticzastavke").on("click", function (event) {
                   // $(this).addClass('btn-success').addClass('disabled').attr('disabled', 'disabled');
                    ShowDocItem($(this).parent().attr('prometid'));
                    $(".uklonistavku").attr('tid', $(this).parent().attr('prometid'));
                });
                GetDocTotal();
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
        $("#pregledstolovaloader").show();
        ShowSection('#pregledstolovasection');
        var strFormattedHTML = '';
        $.ajax({
            url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=GetStoloviNarudzbe',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                $.each(data, function (i, item) {
                    strFormattedHTML = strFormattedHTML
                    + '<tr><td>' + item.oznakauredjaja + '</td><td>' + item.Stol + '</td><td>' + item.sifra + '</td><td>' + item.Roba + '</td><td>' + item.Kolicina + '</td><td>' + item.MPCijena + '</td></tr>'
                });
                $("#pregledstolovalist").html('<table class="table"><thead><tr><th>Uređaj</th><th>Stol</th><th>Šifra</th><th>Naziv</th><th>Količina</th><th>Cijena</th></tr></thead><tbody>' + strFormattedHTML + '</tbody></table>');
                $("#pregledstolovaloader").hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError);
            }
        });
    }

    // ============================================================================= STOLOVI ...

    function GetStolovi() {
        $("#naplataloader").show();
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
                    + '<div class="btn btn-default btn-block btn-lg btnStol" brojstola="' + item.broj + '" >' + '[' + item.broj + '] ' + item.opis + '</div>'
                    + '</div></div>';
                 });

                 $("#stolovilist").html(strFormattedHTML);
              
                $(".btnStol").on('click', function (event) {
                    $(".btnStol").removeClass('btn-danger');
                    $(this).addClass('btn-danger');
                    $.Storage.set({ "brojstola": $(this).attr('brojstola') });
                    $("#brojstola,.brojstola").html($(this).attr('brojstola'));
                });
               
                if ($.Storage.get("brojstola") != undefined) { $("#brojstola,.brojstola").html($.Storage.get("brojstola")); $(".btnStol[brojstola='" + $.Storage.get("brojstola") + "']").addClass('btn-danger'); } else { $("#brojstola,.brojstola").html('1'); $(".btnStol[brojstola='1']").addClass('btn-danger'); };

            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError);
            }
        });
    } 

    // ============================================================================= NACINI PLACANJA ...

    $(".naplata").click(function () {
        ShowSection('#naplataitemslistwrapper');
        if (POSType == 'N') { $("#naplataitemslist").hide();}
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
    });
    
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
                    } else {
                        // $(".errordescription").html(item.errdescription);
                    }
                });
                $("#desktoploader,#desktoploader2").hide();
                GetDocTotal();
                GetSearchProductsList(0);
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
            url: strCrossDomainServiceURL + '?o=' + strDevice + '&d=' + $("#d").val() + '&g=' + $("#g").html() + '&a=SaveQty&id=' + $("#kolicina").attr('data-id') + '&qty=' + $("#kolicina").val() + '&popust=' + $("#popust").val(),
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

    // ============================================================================= KRAJ ...
    
    $(".pokaziopcijedokumenta").click(function () {
        ShowSection('.dugmicizaprodaju');  
    });

    $(".btnkraj").click(function () {
        ShowSection('#krajsection');
    });

    $(".nastavidugmic,.pokazistavkedokumenta").click(function () {
        $("#krajsection").hide();
        GetDocumentItems();
        //$("#searchproductstext").focus();
    });

    $(".glavnimenidugmic").click(function () {
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
        $(".canceldocsection").hide();
        $(".docitemsection").hide();
        $("#speeddial").hide();
        $("#pregledstolovasection").hide();
        $(sectionname).show();
       // $("#searchproductstext").focus();
    }
   
    // ============================================================================= 

    $(".butonzakomentiranje").click(function () {
        ShowSection('#commentsection');
    });

});                                           // end of document ready
   