<!--#include file="JSON_2.0.4.asp"-->
<!--#include file="JSON_UTIL_0.1.1.asp"-->
<%

    response.CodePage=65001
    response.CharSet = "UTF-8"
    Response.ContentType = "application/json"
    Response.AddHeader "Content-Type", "application/json;charset=UTF-8"
    
    Dim Conn
    Dim cs 
    Dim SQLLogin
    Dim action
    dim sql
    dim jsoncallback
    dim id
    dim value
    dim guid
    dim database
    dim OznakaUredjaja
    action=""
    sql=""
    id=0
    value=""
    guid=""
    SQLLogin = ""
    SQLLoginPass = ""
    cs=""
    
    SQLLogin = readx2("d","") ' sql login
    SQLLoginPass = readx2("lp","") ' sql login password
    database = ""

    action = readx2("a","") ' action
    sql = readx2("sql","") 
    id = readx2("id",0)
    value = readx2("value","")
    guid = readx2("g","") ' guid
    
    jsoncallback = request.QueryString("jsoncallback") ' jsoncallback
    OznakaUredjaja = ""
    OznakaUredjaja  = trim(Request.QueryString("o"))

    if SQLLogin="" then 
        ' ako na klijentu nije unešen sql login onda radim sa MPBlagajnom i SA blank
        database = "MPBlagajna"
        cs = "DRIVER={SQL Server};SERVER=JUPITER2008R2;UID=sa;PWD=;DATABASE=" & database & ";"
    else
        ' ako imam sql login onda idem preko njega
        database = SQLLogin 
        'cs = "Driver={SQL Server};UID=" & SQLLogin & ";PWD=" & SQLLoginPass & ";"
        cs = "DRIVER={SQL Server};SERVER=kkovac-lap;UID=sa;PWD=tan5;DATABASE=" & database & ";"
    end if
  
    OpenDBConnection  

    if action="login" then Login
    if action="GetSearchProductsList" then GetSearchProductsList
    if action="GetNacinPlac" then GetNacinPlac
    if action="GetStolovi" then GetStolovi
    if action="GetKlase" then GetKlase
    if action="GetStoloviNarudzbe" then GetStoloviNarudzbe
    if action="AddProductToDocument" then AddProductToDocument
    if action="GetDocumentItems" then GetDocumentItems
    if action="GetDocumentItem" then GetDocumentItem
    if action="SaveDoc" then SaveDoc
    if action="SaveQty" then SaveQty
    if action="GetDocTotal" then GetDocTotal
    if action="CancelDoc" then CancelDoc
    
    CloseDBConnection
 
sub SaveQty
    on error resume next
    if CheckGUID = "" then 
        response.Write ""
        exit sub
    end if
    sql = "update tempp2 set kolicina=" & Replace(readx2("Qty",0), ",", ".") & " where prometid=" & id
    err.Clear
    conn.execute(sql)
    if err.number <> 0 then
        sql = "select  '" & err.number & "' as errnumber,'" & err.Description & "' as errdescription"
        else
        sql = "select  '0' as errnumber,'' as errdescription"
    end if
    CROSSDOMAIN_SqlToJSON(sql)
end sub


sub SaveDoc
    on error resume next

     if CheckGUID = "" then 
        response.Write ""
        exit sub
    end if

    

    PrviIznos = 0
    DrugiIznos = 0
    TreciIznos = 0
    CetvrtiIznos = 0
    PetiIznos = 0

    PrviNacinPlacanjaId = 0 
    DrugiNacinPlacanjaId = 0
    TreciNacinPlacanjaId = 0
    CetvrtiNacinPlacanjaId = 0
    PetiNacinPlacanjaId = 0
    
    Odradio = False

    For Each objItem In Request.QueryString
     
            ScriptId="PayTime"
			if left(objitem,len(ScriptId))=ScriptId then
			obj = fstr(right(objItem,len(objItem)-len(ScriptId)))
			  vrijednost = trim(Request.QueryString(objItem))
			  Vrijednost = replace(vrijednost,chr(39),chr(39) & chr(39))
    
              if vrijednost <> "0" then

                    If PrviIznos = 0 Then
                        PrviIznos = Vrijednost
                        PrviNacinPlacanjaId = obj
                        Odradio = True
                    End If

                    If DrugiIznos = 0 And PrviIznos <> 0 And Odradio = False Then
                        DrugiIznos = Vrijednost
                        DrugiNacinPlacanjaId = obj
                        Odradio = True
                    End If
            
                    If TreciIznos = 0 And DrugiIznos <> 0 And Odradio = False Then
                        TreciIznos = Vrijednost
                        TreciNacinPlacanjaId = obj
                        Odradio = True
                    End If
            
                    If CetvrtiIznos = 0 And TreciIznos <> 0 And Odradio = False Then
                        CetvrtiIznos = Vrijednost
                        CetvrtiNacinPlacanjaId = obj
                        Odradio = True
                    End If
            
                    If PetiIznos = 0 And CetvrtiIznos <> 0 And Odradio = False Then
                        PetiIznos = Vrijednost
                        PetiiNacinPlacanjaId = obj
                        Odradio = True
                    End If
        
              end if
	      	  'sql = "update shops set name ='" & vrijednost & "' where id=" & fnumb(obj)
			  'conn.execute(sql)
			end if
        Odradio = False
	next

    BrojRata = 1
    R1="null"
    R1zakontignet="null"
    BrojRata="1"
    BrojPartije=""
    strNapomena=""
    BrojBodova="0"
    strSifraClana="0"
    R1b="null"
    strPartnerid="0"
    strYear = year(date)
    nezakInd = ""

    POSType = ""
    POSType = trim(Request.QueryString("POSType"))
    BrojStola = ""
    BrojStola  = trim(Request.QueryString("brojstola"))

    if POSType = "N" then
        sql = "spMPPrometTemp2 @action = 1 , @naziv='" & BrojStola & "', @OznakaUredjaja='" & OznakaUredjaja & "', @sifraclana = ''"
    else
        sql = "spSpremi2 @operateriid=" & CheckGUID & ",@partnerid=" & strPartnerid & ",@god=" & strYear & ",@nezakind='" & nezakInd & "'" & _
            ",@PrviIznos=" & Replace(PrviIznos, ",", ".") & _
            ",@DrugiIznos=" & Replace(DrugiIznos, ",", ".") & _
            ",@TreciIznos=" & Replace(TreciIznos, ",", ".") & _
            ",@CetvrtiIznos=" & Replace(CetvrtiIznos, ",", ".") & _
            ",@PetiIznos=" & Replace(PetiIznos, ",", ".") & _
            ",@PrviNacinPlacanjaId=" & Replace(PrviNacinPlacanjaId, ",", ".") & _
            ",@DrugiNacinPlacanjaId=" & Replace(DrugiNacinPlacanjaId, ",", ".") & _
            ",@treciNacinPlacanjaId=" & Replace(TreciNacinPlacanjaId, ",", ".") & _
            ",@cetvrtiNacinPlacanjaId=" & Replace(CetvrtiNacinPlacanjaId, ",", ".") & _
            ",@petiNacinPlacanjaId=" & Replace(PetiNacinPlacanjaId, ",", ".") & _
            ",@KupciR1ID=" & R1 & _
            ",@KupciR1IDKONT=" & R1zakontignet & _
            ",@BrojRata=" & BrojRata & _
            ",@BrojPartije='" & BrojPartije & "'" & ",@Napomena='" & Replace(strNapomena, "'", "") & "'" & _
            ",@brojbodova=" & Replace(BrojBodova, ",", ".") & ",@SifraClana='" & strSifraClana & "',@KupciKreditId=" & R1b & _
            ""
    end if

    err.Clear
    conn.execute(sql)

    'response.Write sql
    'response.end

    if err.number <> 0 then
        sql = "select  '" & err.number & "' as errnumber,'" & err.Description & "' as errdescription"
        else
        sql = "select  '0' as errnumber,'' as errdescription"
    end if

    CROSSDOMAIN_SqlToJSON(sql)

end sub



sub AddProductToDocument
             on error resume next
             robaid = readx2("robaid",0)
             mpcijena = readx2("mpcijena",0)

             DefoltnaKolicina = "1"
             Partneriid = 258
    
             strssOperateriID = "null"
             strssUgovorID = "null"
             MjeSif = "01"
             Kasa = "01"
             strnapomena=""
             strBrojDokumenta = "5555"
             strDatum = "20121029"

             err.Clear
           
             sql1 = "select robaid,coalesce(mpcijena,0) as [mpcijena],jm,tarifaid,coalesce(proizvodind,0) as [proizvodind], porezpp, coalesce(porezippid,0) as porezippid from roba where robaid=" &  robaid 
             'response.write sql1
             'response.end
             Set trs = Conn.Execute(sql1)
             if not trs.eof then
                mpcijena = trs("mpcijena")
             end if
             err.Clear
   
                sql2 = "insert into tempp2" & _
                      " (Robaid,CijAmb,MPCijena,MPCijenaOrg,Kolicina,Partneriid,Operateriid," & _
                      " DatumDok,Za_Platiti,IznNacin," & _
                      " SifraNacinPlac,MjeSif,Rabat,tarifaid,vrijeme,BrojDok,kasa,Rabat1,Rabat2,Opis,BrojRata,donoskasa,donosprometid,brojbodova,brojbodovaprije,rabatnom, porezpp, porezippid, iznospp, ssoperateriid, ugovoriid,oznakauredjaja) " & _
                      " values(" & robaid & _
                      ",0," & Replace(mpcijena, ",", ".") & _
                      "," & Replace(mpcijena, ",", ".") & _
                      "," & Replace(DefoltnaKolicina, ",", ".") & _
                      "," & Partneriid & _
                      "," & CheckGUID() & _
                      ",'" & strDatum & _
                      "',0,0,0,'" & MjeSif & "',0," & Replace(trs("tarifaid"), ",", ".") & ",getdate(),'" & strBrojDokumenta & "','" & Kasa & _
                      "',0,0,'" & left(strnapomena , 50) & "',0,'',0,0,0,0," & Replace(trs("porezpp"), ",", ".") & _
                      "," & Replace(trs("porezippid"), ",", ".") & ",0," & strssOperateriID & "," & strssUgovorID & ",'" & OznakaUredjaja & "')"
           
                Conn.Execute (sql2)

          'response.write sql2
          'response.end
     
          if err.number <> 0 then
                sql = "select  '" & err.number & "' as errnumber,'" & err.Description & "' as errdescription"
                else
                sql = "select  '0' as errnumber,'' as errdescription"
          end if

          CROSSDOMAIN_SqlToJSON(sql)
    
end sub

sub CancelDoc
        on error resume next
        sql = "delete from tempp2"
        conn.execute(sql)
        if err.number <> 0 then
            sql = "select  '" & err.number & "' as errnumber,'" & err.Description & "' as errdescription"
            else
            sql = "select  '0' as errnumber,'' as errdescription"
        end if
        CROSSDOMAIN_SqlToJSON(sql)
end sub

sub GetDocTotal
        on error resume next
        sql = "select isnull(SUM(kolicina * mpcijena),0) as doctotal, count(*) as brojstavki from tempp2 where oznakauredjaja='" & OznakaUredjaja & "'"
        CROSSDOMAIN_SqlToJSON(sql)
end sub
  
sub GetNacinPlac
    sql = "select LTRIM(rtrim(sifranacinplac)) as SifraNacinPlac,ltrim(rtrim(Naziv)) as Naziv from NacinPlac order by sort"  
    CROSSDOMAIN_SqlToJSON(sql)
end sub

sub GetKlase
    sql = "select MPKLasaKasaID,naziv from mpklasakasa"  
    CROSSDOMAIN_SqlToJSON(sql)
end sub

sub GetStolovi
    sql = "select  mpstoloviid,ltrim(rtrim(opis)) as opis,broj from mpstolovi order by broj"  
    CROSSDOMAIN_SqlToJSON(sql)
end sub

sub GetStoloviNarudzbe
    sql = "spPrikaz2 @action=1, @operateriid=" & CheckGUID() & ", @OznakaUredjaja='" & OznakaUredjaja & "'"
    CROSSDOMAIN_SqlToJSON(sql)
end sub

sub GetDocumentItems
    sql = "spPrikaz2 @operateriid=" & CheckGUID() & ", @OznakaUredjaja='" & OznakaUredjaja & "'"
    CROSSDOMAIN_SqlToJSON(sql)
end sub
    
sub GetDocumentItem
    sql = "select Kolicina,MPCijena from tempp2 where prometid=" & id
    CROSSDOMAIN_SqlToJSON(sql)
end sub
    
sub GetSearchProductsList
    klasaid = fnumb(readx2("klasaid","0"))
    if klasaid=0 then
        s = readx2("s","")
        sql = "select top 40 robaid,naziv,mpcijena,barcode,userid from roba where naziv like '%" & s & "%'"
    else
        sql = "select top 120 r.robaid,r.naziv,r.mpcijena,r.barcode,r.userid from roba r inner join MPLNKLasaKasa l on r.RobaId=l.robaid where l.MPKLasaKasaID=" & klasaid
    end if
    CROSSDOMAIN_SqlToJSON(sql)
end sub
     
function CheckGUID
    sql = "select operateriid from ssoperateri where guid='" & guid & "'"
    set trs=Conn.Execute(sql)
    if not trs.eof then 
        CheckGUID=trs("operateriid")
    else
        CheckGUID=0
    end if
end function
    
sub Login
    on error resume next
    if OznakaUredjaja="" then
        response.Write jsoncallback & "({ ""errnumber"" :  ""-1"" , ""errdescription"" :  ""Oznaka ureðaja je obvezan podatak ! "" , ""userguid"" :  ""0""  });"
        exit sub
    end if

    sql = "select * from ssoperateri where naziv='" & readx2("e","") & "' and password='" & readx2("p","") & "'"
	set trs=Conn.Execute(sql)

    if not trs.eof then 
        sql = "update ssoperateri set guid=newid() where operateriid=" & trs("operateriid")
        Conn.Execute(sql)
        sql = "select guid from ssoperateri where operateriid=" & trs("operateriid")
	    set trs2=Conn.Execute(sql)
        response.Write jsoncallback & "({ ""userguid"" :  """ & trs2("guid") & """ , ""username"" :  """ & trim(trs("naziv")) & """ , ""database"" : """ &  database & """ , ""inicijali"" :  """ & trim(trs("inicijali")) & """  });"
    else
        response.Write jsoncallback & "({ ""errnumber"" :  ""-1"" , ""errdescription"" :  ""Provjerite ime i lozinku ! "" , ""userguid"" :  ""0"" });"
    end if
end sub

sub CROSSDOMAIN_SqlToJSON(sql)
    response.Write jsoncallback & "("
    QueryToJSON(Conn, sql).Flush
    response.Write  ");"
end sub
    
Function ReadX2(byval x,byval def)
    ReadX2 = ""
	ReadX2 = fstr(trim(request.form(x)))
	if ReadX2 = "" then
	ReadX2 = fstr(trim(request.querystring(x)))
	end if
	'if ReadX2 = "" then
	'ReadX2 = fstr(request.cookies("param2")(x))
	'end if
	if ReadX2 = "" then
	ReadX2 = fstr(def)
	end if
	
	if lcase(x) = "operateriid" then
	    ReadX2 = operater2id
	end if
end function
    
Function OpenDBConnection 
	on error resume next
	OpenDBConnection = False
 	Set Conn = Server.CreateObject("ADODB.Connection")
	conn.cursorlocation = 3
	conn.Open cs
	if err.number <> 0 then
	    response.Write jsoncallback & "({ ""errnumber"" :  ""-1"" , ""errdescription"" :  ""Greška kod otvaranja konekcije : " & err.Description & """ , ""userguid"" :  ""0"" });"
	    response.End
	   OpenDBConnection = False
	   on error goto 0
	   'CloseDBConnection
	else
	    OpenDBConnection = True
	end if
end function

sub CloseDBConnection 
	on error resume next
	set rs = nothing
	conn.close
	set conn = nothing
	if err.number <> 0 then
	 on error goto 0
	end if
end sub
    
function FNumb(param1)
  on error resume next
  FNumb = replace(param1,",",".")  
  fnumb = cdbl(fnumb)
  if err.number <> 0 then
  fnumb = 0
  on error goto 0
  end if
end function 

function FStr(param1)
  FStr = replace(param1,chr(39),chr(39) & chr(39))  
end function 


%>