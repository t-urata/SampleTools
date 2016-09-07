
// □□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□
// □                                                                                              □
// □                    「プロジェクト情報編集ツール」メインプログラム（情報取得系）              □
// □                                                                                              □
// □ ============================================================================================ □
// □ 概要                                                                                         □
// □ -------------------------------------------------------------------------------------------- □
// □  本ファイルは「プロジェクト情報の一覧の取得」や「プロジェクト情報の更新」など                □
// □  ［プロジェクト情報編集ツール］で行う情報取得系の処理を実施します。                          □
// □                                                                                              □
// □ ============================================================================================ □
// □ 関数一覧                                                                                     □
// □ -------------------------------------------------------------------------------------------- □
// □  SetDefaultSettingView()        ・・・ ［プロジェクト情報一覧］画面の初期値を設定する        □
// □  GetProjectDataList()           ・・・ プロジェクト情報の一覧を取得する                      □
// □  DisplayProjectDataList()       ・・・ プロジェクト情報の一覧を画面に表示する                □
// □  DeleteDisplayData()            ・・・ 画面上に表示された情報を削除する                      □
// □  ClickEditProjectDataButton()   ・・・ ［プロジェクト情報の編集］ボタンクリック時の制御      □
// □  GetEditableRoleList()          ・・・ 計画が編集可能な役割を取得する                        □
// □  GetAccountDataList()           ・・・ アカウント情報の一覧を取得する                        □
// □  GetMonthEndDay()               ・・・ 月の末日を取得する                                    □
// □  RemoveOptionElement()          ・・・ option要素を削除する                                  □
// □  CreateOptionElement()          ・・・ option要素を作成する                                  □
// □  ClickUpdateProjectDataButton() ・・・ ［プロジェクト情報更新］ボタンクリック時の制御        □
// □  CreateSendXmlData()            ・・・ 送信データを作成する                                  □
// □  UpdateProjectData()            ・・・ プロジェクト情報を更新する                            □
// □  ReadSampleConfig()             ・・・ 「SampleConfig.xml」ファイルの情報を読み込む          □
// □  ReadLoginAccountData()         ・・・ ログイン情報を読み込む                                □
// □  CheckHttpRequestResponse()     ・・・ HTTPリクエストのレスポンス情報の確認する              □
// □ ============================================================================================ □
// □                                                                                              □
// □□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□


// =================================================================================================
// 内部共通変数の宣言
// -------------------------------------------------------------------------------------------------
// 概要　　：「プロジェクト情報編集ツール」で利用する共通の変数を宣言します。
// 入力値　：無
// 戻り値　：無
// =================================================================================================
// ログイン情報
	var loginName;				// ログイン名
	var loginPass;				// パスワード

// 接続先情報
	var ServerName;				// サーバーマシン名（ホスト名）
	var TTFXWebServer;			// Web サイト名

// エラー処理用変数
	var error_Flag;				// エラーフラグ（0:エラー無し、1：エラー有り）
	var error_MSG;				// エラーメッセージ

// プロジェクト情報の各項目用配列
	var arrayProjectId;			// プロジェクトID
	var arrayProjectCode;		// プロジェクトコード
	var arrayProjectName;		// プロジェクト名
	var arrayManagerId;			// マネージャID
	var arrayManagerName;		// マネージャ名
	var arraySectionName;		// 組織名
	var arrayStartDate;			// 開始日
	var arrayFinishDate;		// 終了日
	var arrayIsFinished;		// 完了状態
	var arrayProjectStatus;		// ステータス（完了状態の表示文字列）

// 役割情報の各項目用配列
	var arrayRoleId;			// 役割ID
	var arrayRoleIsEditable;	// 計画が編集可能な役割か

// アカウント情報の各項目用配列
	var arrayAccountId;			// アカウントID
	var arrayAccountName;		// アカウント名
	var arrayAccountCode;		// アカウントコード


// =================================================================================================
// ［プロジェクト情報一覧］画面の初期値を設定する
// -------------------------------------------------------------------------------------------------
// 概要　　：プロジェクト情報を取得し、［プロジェクト情報一覧］画面の初期値を設定します。
// 入力値　：無
// 戻り値　：無
// =================================================================================================
function SetDefaultSettingView() {
// 変数の初期化
	error_Flag	= 0;
	error_MSG	= "";

// 接続先情報の確認
	if (error_Flag == 0) {
		ReadSampleConfig();
	}

// ログイン情報の確認
	if (error_Flag == 0) {
		ReadLoginAccountData();
	}

// プロジェクト情報一覧の取得
	if (error_Flag == 0) {
		GetProjectDataList();
	}

	if (error_Flag == 0) {
	// プロジェクト情報一覧なしのエラー処理
		if (arrayProjectId.length == 0) {
			error_Flag	= 1;
			error_MSG	= "編集可能なプロジェクトがありません。";
		}
	}

// プロジェクト情報一覧の表示
	if (error_Flag == 0) {

	// 開始日の降順にソート
		var temp_Array	= new Array();
		var count		= 0;

		for (i in arrayStartDate) {
			temp_Array[count] = arrayStartDate[i] + "|" + i;
			count++;
		}

		temp_Array.sort();
		temp_Array.reverse();

	// ソートされたプロジェクトIDの配列の作成
		var sortProjectId = new Array();
		for (var j = 0; j < temp_Array.length; j++) {
			sortProjectId[j] = temp_Array[j].split("|ProjectId_")[1];
		}

	// ［プロジェクト情報一覧］画面の情報削除
		DeleteDisplayData();

	// プロジェクト情報の一覧の表示
		DisplayProjectDataList(sortProjectId);

	// ［プロジェクト情報一覧］画面への切り替え

/* <<<<< OLD： 引数を用いて関数を共通化
		ChangeSelectView();
========== */
		SwitchViewMode('select');
// >>>>> NEW： ここまで


	}

// エラーの表示
	if (error_Flag == 1) {
	// ログイン画面に戻る
		window.location.href = "./login.html";
		alert(error_MSG);
	}
}

// =================================================================================================
// プロジェクト情報の一覧を取得する
// -------------------------------------------------------------------------------------------------
// 概要　　：TimeTracker FX Web APIでプロジェクト情報の一覧を取得します。
// 入力値　：無
// 戻り値　：無
// =================================================================================================
function GetProjectDataList() {
// オブジェクト作成
	var xml = new ActiveXObject("Microsoft.XMLDOM");
	var REQ = new XMLHttpRequest();

// 同期に設定
	xml.async = false;

// 送信先URL情報の設定
	var url				= "http://" + ServerName + "/" + TTFXWebServer + "/XmlWebService.svc";
	var objectName		= "/projects";
	var queryParameter	= "?limit=0&includeFinished=TRUE&fields=isFinished,canEdit";	// 完了フラグとログインアカウントが編集可能かを追加で取得

// 送信用URLを生成
	url = url + objectName + queryParameter;

// リクエストの作成・送信
	REQ.open('GET', url, false, loginName, loginPass);
	REQ.setRequestHeader("Content-Type","text/xml; charset=utf-8");
	REQ.send();

// リクエストのレスポンスの確認
	CheckHttpRequestResponse(REQ.status, REQ.responseXML);

	if (error_Flag == 0) {
	// リクエストの結果の取得
		xml.loadXML(REQ.responseText);

	// 取得した情報を配列に格納
		var arrayProject = xml.getElementsByTagName("project");

	// 変数の初期化
		arrayProjectId		= new Array();
		arrayProjectCode	= new Array();
		arrayProjectName	= new Array();
		arrayManagerId		= new Array();
		arrayManagerName	= new Array();
		arraySectionName	= new Array();
		arrayStartDate		= new Array();
		arrayFinishDate		= new Array();
		arrayIsFinished		= new Array();
		arrayProjectStatus	= new Array();
		var count = 0;

	// プロジェクト情報の各項目用配列に格納
		for (var i = 0; i < arrayProject.length; i++) {
		// 編集可能なプロジェクトのみ配列に格納
			if (arrayProject[i].getElementsByTagName("canEdit")[0].text == "True") {
				arrayProjectId[count]									= arrayProject[i].getElementsByTagName("id")[0].text;
				arrayProjectCode["ProjectId_" + arrayProjectId[count]]	= arrayProject[i].getElementsByTagName("code")[0].text;
				arrayProjectName["ProjectId_" + arrayProjectId[count]]	= arrayProject[i].getElementsByTagName("name")[0].text;
				arrayManagerId["ProjectId_" + arrayProjectId[count]]	= arrayProject[i].getElementsByTagName("managerId")[0].text;
				arrayManagerName["ProjectId_" + arrayProjectId[count]]	= arrayProject[i].getElementsByTagName("managerName")[0].text;
				arraySectionName["ProjectId_" + arrayProjectId[count]]	= arrayProject[i].getElementsByTagName("sectionName")[0].text;
				arrayStartDate["ProjectId_" + arrayProjectId[count]]	= arrayProject[i].getElementsByTagName("plannedStartDate")[0].text;
				arrayFinishDate["ProjectId_" + arrayProjectId[count]]	= arrayProject[i].getElementsByTagName("plannedFinishDate")[0].text;
				arrayIsFinished["ProjectId_" + arrayProjectId[count]]	= arrayProject[i].getElementsByTagName("isFinished")[0].text;

				if (arrayProject[i].getElementsByTagName("isFinished")[0].text == "True") {
					arrayProjectStatus["ProjectId_" + arrayProjectId[count]] = "終了済み";
				} else {
					arrayProjectStatus["ProjectId_" + arrayProjectId[count]] = "稼働中";
				}
				count++;
			}
		}
	}
}


// =================================================================================================
// プロジェクト情報の一覧を画面に表示する
// -------------------------------------------------------------------------------------------------
// 概要　　：プロジェクト情報の一覧を［プロジェクト情報一覧］画面に表示します。
// 入力値　：projectIdList ･･･ 表示対象のプロジェクトID一覧
// 戻り値　：無
// =================================================================================================
function DisplayProjectDataList(projectIdList) {
// 表示先の指定
	var projectListTable	= document.getElementById("projectListTable");
	var tableBody			= projectListTable.getElementsByTagName("tbody")[0];

// フォントサイズ・列幅の指定
	var fontSize			= 2;
	var widthRadioButton	= 30;
	var widthProjectCode	= 130;
	var widthProjectName	= 150;
	var widthManagerName	= 100;
	var widthSectionName	= 100;
	var widthStartDate		= 70;
	var widthFinishDate		= 70;
	var widthProjectStatus	= 60;

	for (var i = 0; i < projectIdList.length; i++) {
	// ラジオボタンの作成
		var tdRadioButton		= document.createElement("<input name='radioButtonSelectProject'>");
		tdRadioButton.getAttributeNode('type').nodeValue	= "radio";
		tdRadioButton.getAttributeNode('value').nodeValue	= projectIdList[i];

	// テキストノードの作成
		var tdTextProjectCode	= document.createTextNode(arrayProjectCode["ProjectId_" + projectIdList[i]]);
		var tdTextProjectName	= document.createTextNode(arrayProjectName["ProjectId_" + projectIdList[i]]);
		var tdTextManagerName	= document.createTextNode(arrayManagerName["ProjectId_" + projectIdList[i]]);
		var tdTextSectionName	= document.createTextNode(arraySectionName["ProjectId_" + projectIdList[i]]);
		var tdTextStartDate		= document.createTextNode(arrayStartDate["ProjectId_" + projectIdList[i]]);
		var tdTextFinishDate	= document.createTextNode(arrayFinishDate["ProjectId_" + projectIdList[i]]);
		var tdTextProjectStatus	= document.createTextNode(arrayProjectStatus["ProjectId_" + projectIdList[i]]);

	// font要素の作成
		var tdFontProjectCode	= document.createElement("font");
		var tdFontProjectName	= document.createElement("font");
		var tdFontManagerName	= document.createElement("font");
		var tdFontSectionName	= document.createElement("font");
		var tdFontStartDate		= document.createElement("font");
		var tdFontFinishDate	= document.createElement("font");
		var tdFontProjectStatus	= document.createElement("font");

	// フォントサイズの設定
		tdFontProjectCode.getAttributeNode('size').nodeValue	= fontSize;
		tdFontProjectName.getAttributeNode('size').nodeValue	= fontSize;
		tdFontManagerName.getAttributeNode('size').nodeValue	= fontSize;
		tdFontSectionName.getAttributeNode('size').nodeValue	= fontSize;
		tdFontStartDate.getAttributeNode('size').nodeValue		= fontSize;
		tdFontFinishDate.getAttributeNode('size').nodeValue		= fontSize;
		tdFontProjectStatus.getAttributeNode('size').nodeValue	= fontSize;

	// td要素の作成
		var tdElementRadioButton	= document.createElement("td");
		var tdElementProjectCode	= document.createElement("td");
		var tdElementProjectName	= document.createElement("td");
		var tdElementManagerName	= document.createElement("td");
		var tdElementSectionName	= document.createElement("td");
		var tdElementStartDate		= document.createElement("td");
		var tdElementFinishDate		= document.createElement("td");
		var tdElementProjectStatus	= document.createElement("td");

	// 列幅の設定
		tdElementRadioButton.getAttributeNode('width').nodeValue	= widthRadioButton;
		tdElementProjectCode.getAttributeNode('width').nodeValue	= widthProjectCode;
		tdElementProjectName.getAttributeNode('width').nodeValue	= widthProjectName;
		tdElementManagerName.getAttributeNode('width').nodeValue	= widthManagerName;
		tdElementSectionName.getAttributeNode('width').nodeValue	= widthSectionName;
		tdElementStartDate.getAttributeNode('width').nodeValue		= widthStartDate;
		tdElementFinishDate.getAttributeNode('width').nodeValue		= widthFinishDate;
		tdElementProjectStatus.getAttributeNode('width').nodeValue	= widthProjectStatus;


	// 表示位置の設定
		tdElementRadioButton.getAttributeNode('align').nodeValue	= "center";
		tdElementStartDate.getAttributeNode('align').nodeValue		= "center";
		tdElementFinishDate.getAttributeNode('align').nodeValue		= "center";
		tdElementProjectStatus.getAttributeNode('align').nodeValue	= "center";

	// tr要素の作成
		var trElement = document.createElement("tr");

	// font要素にテキストノードを追加
		tdFontProjectCode.appendChild(tdTextProjectCode);
		tdFontProjectName.appendChild(tdTextProjectName);
		tdFontManagerName.appendChild(tdTextManagerName);
		tdFontSectionName.appendChild(tdTextSectionName);
		tdFontStartDate.appendChild(tdTextStartDate);
		tdFontFinishDate.appendChild(tdTextFinishDate);
		tdFontProjectStatus.appendChild(tdTextProjectStatus);

	// td要素にラジオボタンを追加
		tdElementRadioButton.appendChild(tdRadioButton);

	// td要素にfont要素を追加
		tdElementProjectCode.appendChild(tdFontProjectCode);
		tdElementProjectName.appendChild(tdFontProjectName);
		tdElementManagerName.appendChild(tdFontManagerName);
		tdElementSectionName.appendChild(tdFontSectionName);
		tdElementStartDate.appendChild(tdFontStartDate);
		tdElementFinishDate.appendChild(tdFontFinishDate);
		tdElementProjectStatus.appendChild(tdFontProjectStatus);
		
	// tr要素にtd要素を追加
		trElement.appendChild(tdElementRadioButton);	// ラジオボタン
		trElement.appendChild(tdElementProjectCode);	// プロジェクトコード
		trElement.appendChild(tdElementProjectName);	// プロジェクト名
		trElement.appendChild(tdElementManagerName);	// マネージャ名
		trElement.appendChild(tdElementSectionName);	// 組織名
		trElement.appendChild(tdElementStartDate);		// 開始日
		trElement.appendChild(tdElementFinishDate);		// 終了日
		trElement.appendChild(tdElementProjectStatus);	// ステータス

	// tbody要素にtr要素の追加
		tableBody.appendChild(trElement);
	}
}


// =================================================================================================
// 画面上に表示された情報を削除する
// -------------------------------------------------------------------------------------------------
// 概要　　：［プロジェクト情報一覧］画面に表示された情報を削除します。
// 入力値　：無
// 戻り値　：無
// =================================================================================================
function DeleteDisplayData() {
// 削除箇所の指定
	var targetTable = document.getElementById("projectListTable");

// tbody要素の情報を削除
	var tableBody		= targetTable.getElementsByTagName("tbody")[0];
	var arrayTr			= tableBody.getElementsByTagName("tr");
	var arrayTrLength	= arrayTr.length;

	for (var y = 0; y < arrayTrLength; y++) {
	// tr要素の削除
		tableBody.removeChild(arrayTr[0]);
	}
}


// =================================================================================================
// ［プロジェクト情報の編集］ボタンクリック時の制御
// -------------------------------------------------------------------------------------------------
// 概要　　：選択されているプロジェクトを検索し、［プロジェクト情報編集］画面の各フォームの
// 　　　　　初期値の入力と選択肢の設定を実施します。
// 入力値　：無
// 戻り値　：無
// =================================================================================================
function ClickEditProjectDataButton() {
// 変数の初期化
	error_Flag	= 0;
	error_MSG	= "";

// 検索対象の指定
	var projectListTable	= document.getElementById("projectListTable");
	var tableBody			= projectListTable.getElementsByTagName("tbody")[0];
	var radioButtonList		= tableBody.getElementsByTagName('input');

// 選択プロジェクトのプロジェクトID用変数の初期化
	var selectProjectId = -1;

// 選択プロジェクトの検索
	for (var i = 0; i < radioButtonList.length; i++) {
		if(radioButtonList[i].checked){
		// 選択プロジェクトのプロジェクトIDの取得
			selectProjectId = radioButtonList[i].value;
			break;
		}
	}

// 選択プロジェクトなしのエラー処理
	if (selectProjectId == -1) {
		error_Flag	= 1;
		error_MSG	= error_MSG + "プロジェクトを選択してください。";
	}

// ［プロジェクト情報編集］画面の各フォームへ入力
	if (error_Flag == 0) {
	// プロジェクトID（hiddenに格納）への入力
		document.getElementById("projectId").value		= selectProjectId;

	// プロジェクトコードへの入力
		document.getElementById("projectCode").value	= arrayProjectCode["ProjectId_" + selectProjectId];

	// プロジェクト名への入力
		document.getElementById("projectName").value	= arrayProjectName["ProjectId_" + selectProjectId];

	// マネージャ名の選択肢の表示
		// 計画が編集可能な役割の取得
		GetEditableRoleList();

		// 計画が編集可能な役割のアカウント情報一覧の取得
		GetAccountDataList();

		// ソート用アカウントコードの配列の作成
		var tempArrayAccountCode = new Array();
		var count = 0;
		for (var id in arrayAccountCode) {
			// 「'accountCode'|AccountId_'accountID'」の形式で配列に格納
			tempArrayAccountCode[count] = arrayAccountCode[id].toUpperCase() + "|" + id; 
			count++;
		}

		// アカウントコードを昇順にソート
		tempArrayAccountCode.sort();

		// ソートされたアカウントIDの配列を作成
		var sortArrayAccountId = new Array();
		var count = 0;
		for (var i = 0; i < tempArrayAccountCode.length; i++) {
			sortArrayAccountId[count] = tempArrayAccountCode[i].split("|AccountId_")[1];
			count++;
		}

		// 取得したアカウント情報一覧に現在のマネージャがいるかのフラグ（0:いない、1:いる）
		var currentManagerFlag = 0;

		// 入力先の指定
		var selectManager = document.getElementsByName("selectManager")[0];
		RemoveOptionElement(selectManager);

		// マネージャ名の選択肢の設定
		for (var i = 0; i < sortArrayAccountId.length; i++) {
			// テキストノードの作成（アカウント名）
			var optionText = document.createTextNode(arrayAccountName["AccountId_" + sortArrayAccountId[i]]);

			// option要素の作成
			var option = document.createElement("option");
			option.getAttributeNode('value').nodeValue = sortArrayAccountId[i];

			// 初期選択値の設定
			if (sortArrayAccountId[i] == arrayManagerId["ProjectId_" + selectProjectId]) {
				option.getAttributeNode('selected').nodeValue = true;
				currentManagerFlag = 1;
			}

			// option要素にテキストノードを追加
			option.appendChild(optionText);

			// select要素にoption要素を追加
			selectManager.appendChild(option);
		}

		// 取得したアカウント情報一覧に現在のマネージャがいない場合の処理
		if (currentManagerFlag == 0) {
			// テキストノードの作成（アカウント名）
			var optionText = document.createTextNode(arrayManagerName["ProjectId_" + selectProjectId]);

			// option要素の作成
			var option = document.createElement("option");
			option.getAttributeNode('value').nodeValue		= selectProjectId;
			option.getAttributeNode('selected').nodeValue	= true;

			// option要素にテキストノードを追加
			option.appendChild(optionText);

			// select要素にoption要素を追加
			selectManager.appendChild(option);
		}

	// 組織名への入力
		// 入力先の指定
		var tdSectionName = document.getElementById("sectionName");

		// 入力先を初期化
		tdSectionName.removeChild(tdSectionName.childNodes[0]);

		// 入力
		var tdSectionNameText = document.createTextNode(arraySectionName["ProjectId_" + selectProjectId]);
		tdSectionName.appendChild(tdSectionNameText);

	// ［開始日］と［終了日］の入力
		// 実行時の日付の情報を取得
		var todayDate	= new Date();
		var todayYear	= todayDate.getYear();

		// プロジェクトの［開始日］の情報を取得
		var startDate	= new Date(arrayStartDate["ProjectId_" + selectProjectId]);
		var startYear	= startDate.getYear();
		var startMonth	= startDate.getMonth() + 1;
		var startDay	= startDate.getDate();

		// プロジェクトの［終了日］の情報を取得
		var finishDate	= new Date(arrayFinishDate["ProjectId_" + selectProjectId]);
		var finishYear	= finishDate.getYear();
		var finishMonth	= finishDate.getMonth() + 1;
		var finishDay	= finishDate.getDate();

		// ［年］の選択肢の最大値と最小値の決定
		var minSelectYear	= startYear - 3;
		var maxSelectYear	= finishYear + 5;

		if (todayYear < minSelectYear) {
			minSelectYear = todayYear - 1;
		}

		if (maxSelectYear < todayYear) {
			maxSelectYear = todayYear + 1;
		}

	// ［開始日］の［年］の設定
		var selectStartYear = document.getElementsByName("selectStartYear")[0];
		RemoveOptionElement(selectStartYear);
		CreateOptionElement(selectStartYear, minSelectYear, maxSelectYear, startYear);

	// ［開始日］の［月］の設定
		document.getElementsByName("selectStartMonth")[0].selectedIndex = startMonth - 1;

	// ［開始日］の［日］の設定
		var selectStartDay = document.getElementsByName("selectStartDay")[0];
		RemoveOptionElement(selectStartDay);

		// 選択月の末日の日の取得
		var endSelectStartDay = GetMonthEndDay(startYear, startMonth);
		CreateOptionElement(selectStartDay, 1, endSelectStartDay, startDay);

	// ［終了日］の［年］の設定
		var selectFinishYear = document.getElementsByName("selectFinishYear")[0];
		RemoveOptionElement(selectFinishYear);
		CreateOptionElement(selectFinishYear, minSelectYear, maxSelectYear, finishYear);

	// ［終了日］の［月］の設定
		document.getElementsByName("selectFinishMonth")[0].selectedIndex = finishMonth - 1;

	// ［終了日］の［日］の設定
		var selectFinishDay = document.getElementsByName("selectFinishDay")[0];
		RemoveOptionElement(selectFinishDay);

		// 選択月の末日の日の取得
		var endSelectFinishDay = GetMonthEndDay(finishYear, finishMonth);
		CreateOptionElement(selectFinishDay, 1, endSelectFinishDay, finishDay);

	// ［ステータス］の入力
		var selectStatus = document.getElementsByName("selectStatus")[0];
		if (arrayIsFinished["ProjectId_" + selectProjectId] == "False") {
			selectStatus.selectedIndex = 0;	// 「稼働中」を選択
		} else {
			selectStatus.selectedIndex = 1;	// 「終了済み」を選択
		}

	// ［プロジェクト情報編集］画面への切り替え

/* <<<<< OLD： 引数を用いて関数を共通化
		ChangeEditView();
========== */
		SwitchViewMode('edit')
// >>>>> NEW： ここまで

	}

// エラーの表示
	if (error_Flag == 1) {
		alert(error_MSG);
	}
}


// =================================================================================================
// 計画が編集可能な役割を取得する
// -------------------------------------------------------------------------------------------------
// 概要　　：計画が編集可能（［計画編集］または［計画作成］権限がある）な役割を取得します。
// 入力値　：無
// 戻り値　：無
// =================================================================================================
function GetEditableRoleList() {
// オブジェクト作成
	var xml = new ActiveXObject("Microsoft.XMLDOM");
	var REQ = new XMLHttpRequest();

// 同期に設定
	xml.async = false;

// 送信先URL情報の設定
	var url				= "http://" + ServerName + "/" + TTFXWebServer + "/XmlWebService.svc";
	var objectName		= "/system/roles";
	var queryParameter	= "?limit=0";

// 送信用URLを生成
	url = url + objectName + queryParameter;

// リクエストの作成・送信
	REQ.open('GET', url, false, loginName, loginPass);
	REQ.setRequestHeader("Content-Type","text/xml; charset=utf-8");
	REQ.send();

// リクエストの結果の取得
	xml.loadXML(REQ.responseText);

	var arrayRole = xml.getElementsByTagName("role");

// 配列の初期化
	arrayRoleId			= new Array();
	arrayRoleIsEditable	= new Array();

// 役割情報の各項目用配列に格納
	for (var i = 0; i < arrayRole.length; i++) {
	// 役割IDの配列に格納
		arrayRoleId[i] = arrayRole[i].getElementsByTagName("id")[0].text;

	// ［計画編集］と［計画作成］権限の有無に応じて、「計画が編集可能な役割か」の配列に格納
		if ((arrayRole[i].getElementsByTagName("isCreatable")[0].text == "True") || (arrayRole[i].getElementsByTagName("isEditable")[0].text == "True")) {
			arrayRoleIsEditable["RoleId_" + arrayRoleId[i]] = true;		// 編集可能
		} else {
			arrayRoleIsEditable["RoleId_" + arrayRoleId[i]] = false;	// 編集不可
		}
	}
}


// =================================================================================================
// アカウント情報の一覧を取得する
// -------------------------------------------------------------------------------------------------
// 概要　　：アカウント一覧を取得し、計画が編集可能な役割のアカウントの一覧を取得します。
// 入力値　：無
// 戻り値　：無
// =================================================================================================
function GetAccountDataList() {
// オブジェクト作成
	var xml = new ActiveXObject("Microsoft.XMLDOM");
	var REQ = new XMLHttpRequest();

// 同期に設定
	xml.async = false;

// 送信先URL情報の設定
	var url				= "http://" + ServerName + "/" + TTFXWebServer + "/XmlWebService.svc";
	var objectName		= "/system/accounts";
	var queryParameter	= "?limit=0";

// 送信用URLを生成
	url = url + objectName + queryParameter;

// リクエストの作成・送信
	REQ.open('GET', url, false, loginName, loginPass);
	REQ.setRequestHeader("Content-Type","text/xml; charset=utf-8");
	REQ.send();

// リクエストの結果の取得
	xml.loadXML(REQ.responseText);

	var arrayAccount = xml.getElementsByTagName("account");

// 配列の初期化
	arrayAccountId		= new Array();
	arrayAccountName	= new Array();
	arrayAccountCode	= new Array();

	var arrayAccountRoleId = "";
	var count = 0;

// アカウント情報の各項目用配列に格納
	for (var i = 0; i < arrayAccount.length; i++) {
	// 処理中のアカウントの役割IDの取得
		tempAccountRoleId = arrayAccount[i].getElementsByTagName("roleId")[0].text;

	// 処理アカウントの役割が計画編集可能か確認
		if (arrayRoleIsEditable["RoleId_" + tempAccountRoleId]) {
		// 各項目用配列に格納
			arrayAccountId[count]									= arrayAccount[i].getElementsByTagName("id")[0].text;
			arrayAccountName["AccountId_" + arrayAccountId[count]]	= arrayAccount[i].getElementsByTagName("name")[0].text;
			arrayAccountCode["AccountId_" + arrayAccountId[count]]	= arrayAccount[i].getElementsByTagName("code")[0].text;
			count++;
		}
	}
}


// =================================================================================================
// 月の末日を取得する
// -------------------------------------------------------------------------------------------------
// 概要　　：年と月の情報をもとに、月の末日を取得します。
// 入力値　：year  ･･･ 年
// 　　　　　month ･･･ 月
// 戻り値　：末日の日
// =================================================================================================
function GetMonthEndDay(year, month) {
	var endDay = new Date(year, month, 0);
	return(endDay.getDate());
}


// =================================================================================================
// option要素を削除する
// -------------------------------------------------------------------------------------------------
// 概要　　：指定されたselect要素内のoption要素をすべて削除します。
// 入力値　：selectElement ･･･ select要素のオブジェクト
// 戻り値　：無
// =================================================================================================
function RemoveOptionElement(selectElement) {
	// select内の情報（option）の削除
	var arrayOption		= selectElement.getElementsByTagName("option");
	var arrOptionLength	= arrayOption.length;

	for (var y = 0; y < arrOptionLength; y++) {
		selectElement.removeChild(arrayOption[0]);
	}
}


// =================================================================================================
// option要素を作成する
// -------------------------------------------------------------------------------------------------
// 概要　　：指定されたselect要素のoption要素を作成します。
// 入力値　：selectElement ･･･ 対象のselect要素のオブジェクト
// 　　　　　startValue    ･･･ option要素のvalueの開始の値
// 　　　　　endValue      ･･･ option要素のvalueの終了の値
// 　　　　　selectValue   ･･･ option要素の選択値
// 戻り値　：無
// =================================================================================================
function CreateOptionElement(selectElement, startValue, endValue, selectValue) {
	for (var i = startValue; i <= endValue; i++) {
	// 初期化
		var optionValue = "";

		// 1桁の場合に0を付与
		if (i < 10) {
			optionValue = "0" + i;
		} else {
			optionValue = i;
		}

	// テキストノードの作成
		var optionText = document.createTextNode(optionValue);

	// option要素の作成
		var option = document.createElement("option");
		option.getAttributeNode('value').nodeValue = optionValue;

		if (selectValue == i) {
			option.getAttributeNode('selected').nodeValue = true;
		}

	// option要素にテキストノードを追加
		option.appendChild(optionText);

	// select要素にoption要素の内容を追加
		selectElement.appendChild(option);
	}
}


// =================================================================================================
// ［プロジェクト情報更新］ボタンクリック時の制御
// -------------------------------------------------------------------------------------------------
// 概要　　：選択されているプロジェクトを検索し、［プロジェクト情報編集］画面に値を入力します。
// 入力値　：無
// 戻り値　：無
// =================================================================================================
function ClickUpdateProjectDataButton() {
// 変数の初期化
	error_Flag	= 0;
	error_MSG	= "";

// 入力値の取得
	var projectId	= document.getElementById("projectId").value;
	var projectCode	= document.getElementById("projectCode").value;
	var projectName	= document.getElementById("projectName").value;
	var managerId	= document.getElementsByName("selectManager")[0].value;
	var managerName	= document.getElementsByName("selectManager")[0].options[document.getElementsByName("selectManager")[0].selectedIndex].text;
	var startYear	= document.getElementsByName("selectStartYear")[0].value;
	var startMonth	= document.getElementsByName("selectStartMonth")[0].value;
	var startDay	= document.getElementsByName("selectStartDay")[0].value;
	var finishYear	= document.getElementsByName("selectFinishYear")[0].value;
	var finishMonth	= document.getElementsByName("selectFinishMonth")[0].value;
	var finishDay	= document.getElementsByName("selectFinishDay")[0].value;
	var isFinished	= document.getElementsByName("selectStatus")[0].value;
	var status		= document.getElementsByName("selectStatus")[0].options[document.getElementsByName("selectStatus")[0].selectedIndex].text;

	var startDate	= startYear + "-" + startMonth + "-" + startDay;
	var finishDate	= finishYear + "-" + finishMonth + "-" + finishDay;

// プロジェクト名の空文字の確認
	if (projectName == "") {
		error_Flag	= 1;
		error_MSG	= error_MSG + "プロジェクト名を入力してください。";
	}

	if (error_Flag == 0) {
	// ［開始日］・［終了日］の矛盾の確認
		var stringStartDate		= String(startYear) + String(startMonth) + String(startDay);
		var stringFinishDate	= String(finishYear) + String(finishMonth) + String(finishDay);
		
		if (Number(stringFinishDate) < Number(stringStartDate)) {
			error_Flag	= 1;
			error_MSG	= error_MSG + "指定した開始日・終了日に矛盾があります。\n\n"
									+ "開始日には、終了日以降の日付を指定してください。\n"
									+ "終了日には、開始日以前の日付を指定してください。";
		}

	}

	if (error_Flag == 0) {
	// 更新内容の最終確認
		var checkMSG = "以下の内容でプロジェクト情報を更新します。\nよろしいですか。\n\n"
						+ "プロジェクトコード ： "	+ projectCode + "\n"
						+ "プロジェクト名 ： "		+ projectName + "\n"
						+ "マネージャ名 ： "		+ managerName + "\n"
						+ "開始日 ： "				+ startYear + "/" + startMonth + "/" + startDay + "\n"
						+ "終了日 ： "				+ finishYear + "/" + finishMonth + "/" + finishDay + "\n"
						+ "ステータス ： "			+ status;

		if (!confirm(checkMSG)) {
			error_Flag	= 1;
			error_MSG	= error_MSG + "更新はキャンセルされました。";
		}
	}

	if (error_Flag == 0) {
	// 送信データの作成
		var sendData = CreateSendXmlData(projectCode, projectName, managerId, startDate, finishDate, isFinished);

	// プロジェクト情報の更新
		UpdateProjectData(projectId, sendData);
	}

	if (error_Flag == 0) {
	// 更新完了メッセージの表示
		alert("更新が完了しました。");

	// 一覧に戻る
		SetDefaultSettingView();
	}

// エラーの表示
	if (error_Flag == 1) {
		alert(error_MSG);
	}
}


// =================================================================================================
// 送信データを作成する
// -------------------------------------------------------------------------------------------------
// 概要　　：TimeTracker FX Web APIで送信するデータを作成します。
// 入力値　：projectCode ･･･ プロジェクトコード
// 　　　　　projectName ･･･ プロジェクト名
// 　　　　　managerId   ･･･ マネージャID
// 　　　　　startDate   ･･･ プロジェクトの計画開始日
// 　　　　　finishDate  ･･･ プロジェクトの計画終了日
// 　　　　　isFinished  ･･･ 完了フラグ（TRUE:完了、FALSE:未完了）
// 戻り値　：無
// =================================================================================================
function CreateSendXmlData(projectCode, projectName, managerId, startDate, finishDate, isFinished) {
// オブジェクト作成
	var sendXmlData = new ActiveXObject("Microsoft.XMLDOM");

// 同期に設定
	sendXmlData.async = false;

// テキストノード作成
	var textProjectCode	= sendXmlData.createTextNode(projectCode);
	var textProjectName	= sendXmlData.createTextNode(projectName);
	var textManagerId	= sendXmlData.createTextNode(managerId);
	var textStartDate	= sendXmlData.createTextNode(startDate);
	var textFinishDate	= sendXmlData.createTextNode(finishDate);
	var textIsFinished	= sendXmlData.createTextNode(isFinished);

// 要素作成
	var elementProjectCode	= sendXmlData.createElement("code");
	var elementProjectName	= sendXmlData.createElement("name");
	var elementManagerId	= sendXmlData.createElement("managerId");
	var elementStartDate	= sendXmlData.createElement("plannedStartDate");
	var elementFinishDate	= sendXmlData.createElement("plannedFinishDate");
	var elementIsFinished	= sendXmlData.createElement("isFinished");
	var elementProject		= sendXmlData.createElement("project");

// テキストノードを追加
	elementProjectCode.appendChild(textProjectCode);
	elementProjectName.appendChild(textProjectName);
	elementManagerId.appendChild(textManagerId);
	elementStartDate.appendChild(textStartDate);
	elementFinishDate.appendChild(textFinishDate);
	elementIsFinished.appendChild(textIsFinished);

// project要素の組み立て
	elementProject.appendChild(elementProjectCode);
	elementProject.appendChild(elementProjectName);
	elementProject.appendChild(elementManagerId);
	elementProject.appendChild(elementStartDate);
	elementProject.appendChild(elementFinishDate);
	elementProject.appendChild(elementIsFinished);

// オブジェクトに格納
	sendXmlData.appendChild(elementProject);

// 戻り値
	return(sendXmlData);
}


// =================================================================================================
// プロジェクト情報を更新する
// -------------------------------------------------------------------------------------------------
// 概要　　：TimeTracker FX Web APIでプロジェクト情報を更新します。
// 入力値　：projectId ･･･ 更新対象のプロジェクトID
// 　　　　：sendData  ･･･ 更新情報
// 戻り値　：無
// =================================================================================================
function UpdateProjectData(projectId, sendData) {
// オブジェクト作成
	var REQ = new XMLHttpRequest();

// 送信先URL情報の設定
	var url				= "http://" + ServerName + "/" + TTFXWebServer + "/XmlWebService.svc";
	var objectName		= "/projects/" + projectId;

// 送信用URLを生成
	url = url + objectName;

// リクエストの作成・送信・結果の取得
	REQ.open('PUT', url, false, loginName, loginPass);
	REQ.setRequestHeader("Content-Type","text/xml; charset=utf-8");
	REQ.send(sendData);

// リクエストのレスポンスの確認
	CheckHttpRequestResponse(REQ.status, REQ.responseXML);
}


// =================================================================================================
// 「SampleConfig.xml」ファイルの情報を読み込む
// -------------------------------------------------------------------------------------------------
// 概要　　：「SampleConfig.xml」ファイルの情報を読み込み、サーバーマシン名とWebサイト名を取得します。
// 入力値　：無
// 戻り値　：無
// =================================================================================================
function ReadSampleConfig() {

/* <<<<< OLD： XMLファイルの情報読み出しをjQueryで実施
// オブジェクト作成
	var ConfigFile = new ActiveXObject("Microsoft.XMLDOM");

// 同期に設定
	ConfigFile.async = false;

// SampleConfigファイルの読み込み
	ConfigFile.load("./../SampleConfig.xml");

	if (ConfigFile.getElementsByTagName("SampleConfig").length == 0) {
		error_Flag	= 1;
		error_MSG	= error_MSG + "SampleConfig.xmlが正常に読み込めません。";
	} else {
	// サーバーマシン名とWebサイト名の取得
		ServerName		= ConfigFile.getElementsByTagName("ServerName")[0].text;	// サーバーマシン名（ホスト名）
		TTFXWebServer	= ConfigFile.getElementsByTagName("TTFXWebServer")[0].text;	// Webサイト名

		if (ServerName == "") {
			error_Flag	= 1;
			error_MSG	= error_MSG + "SampleConfig.xmlのServerNameにホスト名が入力されいません。\n";
		}

		if (TTFXWebServer == "") {
			error_Flag	= 1;
			error_MSG	= error_MSG + "SampleConfig.xmlのTTFXWebServerにWebサイト名が入力されいません。";
		}
	}
========== */
	$.ajax({
		async:'false',
		url:'../SampleConfig.xml',
		type:'get',
		dataType:'xml',
		timeout:1000,
		success:function(){
			ServerName		= $("ServerName").text();
			TTFXWebServer	= $("TTFXWebServer").text();

			if (ServerName == "") {
				error_Flag	= 1;
				error_MSG	= error_MSG + "SampleConfig.xmlのServerNameにホスト名が入力されいません。\n";
			}

			if (TTFXWebServer == "") {
				error_Flag	= 1;
				error_MSG	= error_MSG + "SampleConfig.xmlのTTFXWebServerにWebサイト名が入力されいません。";
			}
		}
		error:function(){
			error_Flag	= 1;
			error_MSG	= error_MSG + "SampleConfig.xmlが正常に読み込めません。";
		}
	});
// >>>>> NEW： ここまで

}


// =================================================================================================
// ログイン情報を読み込む
// -------------------------------------------------------------------------------------------------
// 概要　　：URLのクエリパラメータのログイン情報を読み込み、ログイン名とパスワードを取得します。
// 入力値　：無
// 戻り値　：無
// =================================================================================================
function ReadLoginAccountData() {
// URLのクエリパラメータの取得
	var loginNameAndPass = location.search;

	if (loginNameAndPass == "") {
		error_Flag	= 1;
		error_MSG	= error_MSG + "login.htmlよりツールを起動してください。";
	} else {
		loginNameAndPass	= loginNameAndPass.substring(1,loginNameAndPass.length);
		var arrayQP			= loginNameAndPass.split("&");

	// ログイン名とパスワードを取得
		loginName	= arrayQP[0].split("=")[1];
		loginPass	= arrayQP[1].split("=")[1];

		if (loginName == "") {
			error_Flag	= 1;
			error_MSG	= error_MSG + "ログイン名を入力してください。";
		}
	}
}


// =================================================================================================
// HTTPリクエストのレスポンス情報の確認する
// -------------------------------------------------------------------------------------------------
// 概要　　：HTTPリクエストのレスポンスに応じて、エラーメッセージを設定します。
// 入力値　：responseCode ･･･ レスポンスコード
// 　　　　　responseXML  ･･･ XML形式のレスポンス
// 戻り値　：無
// =================================================================================================
function CheckHttpRequestResponse(responseCode, responseXML) {
	switch (responseCode) {
		case 200:
		//	error_MSG = error_MSG + "エラーはありません。";
			break;
		case 400:
			error_Flag	= 1;
			error_MSG	= error_MSG + "パラメータやリクエストに不備があります。\n";
			error_MSG	= error_MSG + responseXML.getElementsByTagName("Message")[0].text;
			break;
		case 401:
			error_Flag	= 1;
			error_MSG	= error_MSG + "認証に失敗しました。\n";
			error_MSG	= error_MSG + "ログイン名またはパスワードに誤りがあります。\n";
			break;
		case 404:
			error_Flag	= 1;
			error_MSG	= error_MSG + "指定したソース(URI)が存在しません。";
			break;
		case 405:
			error_Flag	= 1;
			error_MSG	= error_MSG + "指定したHTTPメソッドが使用できません。";
			break;
		case 411:
			error_Flag	= 1;
			error_MSG	= error_MSG + "HTTP リクエストヘッダにContent-Lengthが指定されていません。";
			break;
		case 500:
			error_Flag	= 1;
			error_MSG	= error_MSG + "サーバーでエラーが発生しました。";
			break;
		default:
			error_Flag	= 1;
			error_MSG	= error_MSG + "エラーが発生しました。\n";
			error_MSG	= error_MSG + "SampleConfig.xmlに不備がある可能性があります。";
			break;
	}
}
