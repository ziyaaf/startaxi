/*
-------------------------------------------------
       Epostcode JavaScript Interface 1.01
            17-Oct-2005 Etellect Ltd.
               www.etellect.co.uk

More information on this product can be found at:
         http://www.epostcode.com/
-------------------------------------------------
*/
var reqList;
var returnedXMLList = "";
var reqGetAddress;
var returnedXMLGetAddress = "";
var pageQS = "";
var sServiceName = "SearchMulti";
var sAccountName = "FOURTHSO01";
var sGUID = "87f9502b-9315-4c6b-b9e0-f26224ce8c2f";
var sIPAddress = "";
var sSearchPostcode = "";
var sSearchStreet = "";
var sSearchCompany = "";
var sSearchLocality = "";
var sSearchTownOrCity = "";
var sSearchNumber = "";
var sWebServiceURL = "https://ws.epostcode.com/uk/addressfinder.asmx";
var addressarray = [];
var addressObj = new Object();

window.onload = function() {
    pageQS = new Querystring();
}

function GetAddressList(postcode) {
    console.log("GetAddressList : " );
    var xmlURL = sWebServiceURL;
    sServiceName = "SearchMulti";
    sAccountName = "FOURTHSO01";
    sGUID = "87f9502b-9315-4c6b-b9e0-f26224ce8c2f";
    sIPAddress = GetFormFieldValue("epcIPAddress");
    try {
        // sSearchPostcode = document.getElementById("epcSearchPostcode").value;
        sSearchPostcode = postcode;
    } catch (e) {;
    }
    try {
        sSearchStreet = document.getElementById("epcSearchStreet").value;
    } catch (e) {;
    }
    try {
        sSearchCompany = document.getElementById("epcSearchCompany").value;
    } catch (e) {;
    }
    try {
        sSearchLocality = document.getElementById("epcSearchLocality").value;
    } catch (e) {;
    }
    try {
        sSearchTownOrCity = document.getElementById("epcSearchTownOrCity").value;
    } catch (e) {;
    }
    try {
        sSearchNumber = document.getElementById("epcSearchNumber").value;
        sSearchNumber = GetFormFieldValue("epcSearchNumber");
    } catch (e) {;
    }
    xmlURL += "/SearchMulti?sPostcode=" + escape(sSearchPostcode) + "&sCompany=" + escape(sSearchCompany) + "&sStreet=" + escape(sSearchStreet) + "&sLocality=" + escape(sSearchLocality) + "&sTownOrCity=" + escape(sSearchTownOrCity) + "&sNumber=" + escape(sSearchNumber) + "&sAccountName=" + escape(sAccountName) + "&sGUID=" + escape(sGUID) + "&sIPAddress=" + escape(sIPAddress);
    loadXMLDocList(xmlURL);
}

function GetMyAddressList() {
    if (reqList.readyState == 4) {
        if (reqList.status == 200)

        {
            //Mozilla
            if (document.implementation && document.implementation.createDocument) {
                returnedXMLList = (new DOMParser()).parseFromString(reqList.responseText, "text/xml");
                LoadAddressList();
            }
            //IE
            else if (window.ActiveXObject) {
                returnedXMLList = new ActiveXObject("MSXML2.DOMDocument.3.0");
                returnedXMLList.loadXML(reqList.responseText);
                LoadAddressList();
            } else {
                alert('Your browser cannot handle this script');
            }

        }
    }
}


function LoadAddressList() {
    addressarray = [];
    var StatusCode = returnedXMLList.getElementsByTagName('IsError').item(0).firstChild.data;
    console.log(returnedXMLList);
    if (StatusCode == "false") {
        var intAddressList = returnedXMLList.getElementsByTagName('ListAddress').length;
        // document.getElementById("epcAddressList").options.length = 0;
        // document.getElementById("epcAddressList").options.length = intAddressList;
        for (i = 0; i < intAddressList; i++) {
            fullAddress = returnedXMLList.getElementsByTagName('ListAddress').item(i).firstChild.data;
            absrecnum = returnedXMLList.getElementsByTagName('AbsRecNum').item(i).firstChild.data;
            // document.getElementById("epcAddressList").options[i] = new Option(fullAddress, absrecnum);
            // console.log(fullAddress);
            addressarray.push({id:absrecnum,address:fullAddress});
        }

    } else {
        var StatusDescription = returnedXMLList.getElementsByTagName('ErrorMessage').item(0).firstChild.data;
        var isError = returnedXMLList.getElementsByTagName('IsError').item(0).firstChild.data;
        if(!isError){
            document.getElementById("epcAddressList").options.length = 0;
            document.getElementById("epcAddressList").options.length = 1;
            document.getElementById("epcAddressList").options[0] = new Option(StatusDescription, (1));
        }
    }
}

function loadXMLDocList(url) {
    reqList = false;
    reqList = new XMLHTTP();
    reqList.onreadystatechange = GetMyAddressList;
    reqList.open("GET", url, true);
    reqList.send();
}

function loadXMLDocGetAddress(url) {
    reqGetAddress = false;
    reqGetAddress = new XMLHTTP();
    reqGetAddress.onreadystatechange = GetMyAddress;
    reqGetAddress.open("GET", url, true);
    reqGetAddress.send(null);
}

function GetMyAddress() {
    if (reqGetAddress.readyState == 4) {
        if (reqGetAddress.status == 200)

        {
            //Mozilla
            if (document.implementation && document.implementation.createDocument) {
                returnedXMLGetAddress = (new DOMParser()).parseFromString(reqGetAddress.responseText, "text/xml");
                LoadAddress();
            }
            //IE
            else if (window.ActiveXObject) {
                returnedXMLGetAddress = new ActiveXObject("MSXML2.DOMDocument.3.0");
                returnedXMLGetAddress.loadXML(reqGetAddress.responseText);
                LoadAddress();
            } else {
                alert('Your browser cannot handle this script');
            }

        }
    }
}


function LoadAddress() {
    console.log("Get selected address");
    console.log(returnedXMLGetAddress);
    try {
        document.getElementById("epcLocality").value = returnedXMLGetAddress.getElementsByTagName('Locality').item(0).firstChild.data;
    } catch (e) {
        try {
            document.getElementById("epcLocality").value = "";
        } catch (e) {

        }
        //
    }
    try {
        document.getElementById("epcDepartmentName").value = returnedXMLGetAddress.getElementsByTagName('DepartmentName').item(0).firstChild.data;
    } catch (e) {
        try {
            document.getElementById("epcDepartmentName").value = "";
        } catch (e) {

        }
        //
    }
    try {
        addressObj.subBuildingName = returnedXMLGetAddress.getElementsByTagName('SubBuildingName').item(0).firstChild.data;
    } catch (e) {
        try {
            addressObj.subBuildingName = "-";
        } catch (e) {

        }
    }
    try {
        document.getElementById("epcDependentStreet").value = returnedXMLGetAddress.getElementsByTagName('DependentStreet').item(0).firstChild.data;
    } catch (e) {
        try {
            document.getElementById("epcDependentStreet").value = "";
        } catch (e) {

        }
        //
    }
    try {
        addressObj.streetName = returnedXMLGetAddress.getElementsByTagName('Street').item(0).firstChild.data;
    } catch (e) {
        try {
            addressObj.streetName = "-";
        } catch (e) {

        }
        //
    }
    try {
        addressObj.townOrCity = returnedXMLGetAddress.getElementsByTagName('PostTown').item(0).firstChild.data;
    } catch (e) {
        try {
            addressObj.townOrCity = "-";
        } catch (e) {

        }
        //
    }
    try {
        document.getElementById("epcPostcode").value = returnedXMLGetAddress.getElementsByTagName('PostCode').item(0).firstChild.data;
    } catch (e) {
        try {
            document.getElementById("epcPostcode").value = "-";
        } catch (e) {

        }
        //
    }
    try {
        addressObj.orgName = returnedXMLGetAddress.getElementsByTagName('Organisation').item(0).firstChild.data;
    } catch (e) {
        try {
            addressObj.orgName = "-";
        } catch (e) {

        }
        //
    }
    try {
        addressObj.epcNumber = returnedXMLGetAddress.getElementsByTagName('Number').item(0).firstChild.data;
    } catch (e) {
        try {
            addressObj.epcNumber = "-";
        } catch (e) {

        }
        //
    }
    try {
        addressObj.county = returnedXMLGetAddress.getElementsByTagName('County').item(0).firstChild.data;
    } catch (e) {
        try {
            addressObj.county = "-";
        } catch (e) {

        }
        //
    }
    try {
        addressObj.buildingName = returnedXMLGetAddress.getElementsByTagName('BuildingName').item(0).firstChild.data;
    } catch (e) {
        try {
            addressObj.buildingName = "-";
        } catch (e) {

        }
        //
    }
    try {
        document.getElementById("epcAddressLine1").value = returnedXMLGetAddress.getElementsByTagName('AddressLine1').item(0).firstChild.data;
    } catch (e) {
        try {
            document.getElementById("epcAddressLine1").value = "";
        } catch (e) {

        }
        //
    }
    try {
        document.getElementById("epcAddressLine2").value = returnedXMLGetAddress.getElementsByTagName('AddressLine2').item(0).firstChild.data;
    } catch (e) {
        try {
            document.getElementById("epcAddressLine2").value = "";
        } catch (e) {

        }
        //
    }
    try {
        document.getElementById("epcAddressLine3").value = returnedXMLGetAddress.getElementsByTagName('AddressLine3').item(0).firstChild.data;
    } catch (e) {
        try {
            document.getElementById("epcAddressLine3").value = "";
        } catch (e) {

        }
        //
    }
    try {
        document.getElementById("epcAddressLine4").value = returnedXMLGetAddress.getElementsByTagName('AddressLine4').item(0).firstChild.data;
    } catch (e) {
        try {
            document.getElementById("epcAddressLine4").value = "";
        } catch (e) {

        }
        //
    }
    try {
        document.getElementById("epcAddressLine5").value = returnedXMLGetAddress.getElementsByTagName('AddressLine5').item(0).firstChild.data;
    } catch (e) {
        try {
            document.getElementById("epcAddressLine5").value = "";
        } catch (e) {

        }
        //
    }
    try {
        document.getElementById("epcFullAddress").value = returnedXMLGetAddress.getElementsByTagName('FullAddress').item(0).firstChild.data;
    } catch (e) {
        try {
            document.getElementById("epcFullAddress").value = "";
        } catch (e) {

        }
        //
    }
    try {
        document.getElementById("epcDoubleDependentLocality").value = returnedXMLGetAddress.getElementsByTagName('DoubleDependentLocality').item(0).firstChild.data;
    } catch (e) {
        try {
            document.getElementById("epcDoubleDependentLocality").value = "";
        } catch (e) {

        }
        //
    }
    try {
        document.getElementById("epcGridEasting").value = returnedXMLGetAddress.getElementsByTagName('GridEasting').item(0).firstChild.data;
    } catch (e) {
        try {
            document.getElementById("epcGridEasting").value = "";
        } catch (e) {

        }
        //
    }
    try {
        document.getElementById("epcGridNorthing").value = returnedXMLGetAddress.getElementsByTagName('GridNorthing').item(0).firstChild.data;
    } catch (e) {
        try {
            document.getElementById("epcGridNorthing").value = "";
        } catch (e) {

        }
        //
    }
    try {
        document.getElementById("epcPostOfficeBox").value = returnedXMLGetAddress.getElementsByTagName('PostOfficeBox').item(0).firstChild.data;
    } catch (e) {
        try {
            document.getElementById("epcPostOfficeBox").value = "";
        } catch (e) {

        }
        //
    }
    try {
        document.getElementById("epcUserCategory").value = returnedXMLGetAddress.getElementsByTagName('UserCategory').item(0).firstChild.data;
    } catch (e) {
        try {
            document.getElementById("epcUserCategory").value = "";
        } catch (e) {

        }
        //
    }
    try {
        document.getElementById("epcErrorMessage").value = returnedXMLGetAddress.getElementsByTagName('ErrorMessage').item(0).firstChild.data;
    } catch (e) {
        try {
            document.getElementById("epcErrorMessage").value = "";
        } catch (e) {

        }
        //
    }
    try {
        document.getElementById("epcAbsRecNum").value = returnedXMLGetAddress.getElementsByTagName('AbsRecNum').item(0).firstChild.data;
    } catch (e) {
        try {
            document.getElementById("epcAbsRecNum").value = "";
        } catch (e) {

        }
        //
    }
    try {
        document.getElementById("epcIsError").value = returnedXMLGetAddress.getElementsByTagName('IsError').item(0).firstChild.data;
    } catch (e) {
        try {
            document.getElementById("epcIsError").value = "";
        } catch (e) {

        }
        //
    }
    try {
        MyFormattingFunction();
    } catch (e) {}
    //
    
    console.log("Here");
    
}

function GetAddress(AbsRecNum) {
    var xmlURL = sWebServiceURL;
    sServiceName = "SearchMulti";
    sAccountName = "FOURTHSO01";
    sGUID = "87f9502b-9315-4c6b-b9e0-f26224ce8c2f";
    sIPAddress = GetFormFieldValue("epcIPAddress");
    sSearch = GetFormFieldValue("epcPostcode");
    iTypeOfSearch = GetFormFieldValue("epcSearchType");
    // var selIndex = document.getElementById("epcAddressList").options[document.getElementById("epcAddressList").selectedIndex].value;
    xmlURL += "/GetAddress?sAbsRecNum=" + AbsRecNum + "&sAccountName=" + escape(sAccountName) + "&sGUID=" + escape(sGUID) + "&sIPAddress=" + escape(sIPAddress);
    loadXMLDocGetAddress(xmlURL);
}

function Querystring(qs) {
    this.params = new Object();
    this.get = Querystring_get;
    if (qs == null) {
        qs = location.search.substring(1, location.search.length);
    }
    if (qs.length == 0) {
        return;
    }
    var args = qs.split('&');
    for (var i = 0; i < args.length; i++) {
        var value;
        var pair = args[i].split('=');
        var name = unescape(pair[0]);
        if (pair.length == 2) {
            value = unescape(pair[1]);
        } else {
            value = name
        }
        this.params[name] = value;
    }
}

function Querystring_get(key, default_) {
    if (default_ == null) {
        default_ = null;
    }
    var value = this.params[key];
    if (value == null) {
        value = default_;
    }
    return value;
}

function GetFormFieldValue(what) {
    // return document.getElementById(what).value;
    var intFieldCounter = 0;
    for (intFormCounter = 0; intFormCounter <= document.forms.length - 1; intFormCounter++) {
        for (elementCounter = 0; elementCounter <= document.forms[intFormCounter].length - 1; elementCounter++) {
            if (document.forms[intFormCounter].elements[elementCounter].name == what) {
                return document.forms[intFormCounter].elements[elementCounter].value;
            }
        };
    };
};