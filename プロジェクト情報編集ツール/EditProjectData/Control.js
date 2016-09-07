
// □□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□
// □                                                                                              □
// □                    「プロジェクト情報編集ツール」サブプログラム（制御系）                    □
// □                                                                                              □
// □ ============================================================================================ □
// □ 概要                                                                                         □
// □ -------------------------------------------------------------------------------------------- □
// □  本ファイルは「画面の切り替え」や「セレクトボックス選択時の動作」など                        □
// □  ［プロジェクト情報編集ツール］のインターフェイス操作の制御系の処理を実施します。            □
// □                                                                                              □
// □ ============================================================================================ □
// □ 関数一覧                                                                                     □
// □ -------------------------------------------------------------------------------------------- □

/* <<<<< OLD： 引数を用いて関数を共通化
// □  ChangeSelectView()       ・・・   選択画面表示切替の制御                                    □
// □  ChangeEditView()         ・・・   編集画面表示切替の制御                                    □
========== */
// □  SwitchViewMode()         ・・・   選択・編集画面表示切替の制御                              □
// >>>>> NEW： ここまで

// □  ChangeStartYear()        ・・・  ［開始日］の［年］変更時の制御                             □
// □  ChangeStartMonth()       ・・・  ［開始日］の［月］変更時の制御                             □
// □  ChangeFinishYear()       ・・・  ［終了日］の［年］変更時の制御                             □
// □  ChangeFinishMonth()      ・・・  ［終了日］の［月］変更時の制御                             □
// □                                                                                              □
// □ ============================================================================================ □
// □                                                                                              □
// □□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□

/* <<<<< OLD： 引数を用いて関数を共通化
// =================================================================================================
// 選択画面表示切替の制御
// -------------------------------------------------------------------------------------------------
// 概要　　：プロジェクト情報の編集画面を非表示にし、プロジェクトの選択画面に表示を切り替えます。
// 入力値　：無
// 戻り値　：無
// =================================================================================================
function ChangeSelectView() {
	document.getElementById("editView").style.display	= "none";
	document.getElementById("selectView").style.display	= "inline";
}


// =================================================================================================
// 編集画面表示切替の制御
// -------------------------------------------------------------------------------------------------
// 概要　　：プロジェクトの選択画面を非表示にし、プロジェクト情報の編集画面に表示を切り替えます。
// 入力値　：無
// 戻り値　：無
// =================================================================================================
function ChangeEditView() {
	document.getElementById("selectView").style.display	= "none";
	document.getElementById("editView").style.display	= "inline";
}
========== */
// =================================================================================================
// 選択・編集画面表示切替の制御
// -------------------------------------------------------------------------------------------------
// 概要　　：引数で指定した文字列に対応する画面に表示を切り替えます。
// 入力値　：mode ・・・ 表示画面の指定（select:選択画面、edit:編集画面）
// 戻り値　：無
// =================================================================================================
function SwitchViewMode(mode) {
	switch(mode){
		case 'select':
			document.getElementById("editView").style.display	= "none";
			document.getElementById("selectView").style.display	= "inline";
			break;
		case 'edit':
			document.getElementById("editView").style.display	= "inline";
			document.getElementById("selectView").style.display	= "none";
	}
}
// >>>>> NEW： ここまで


// =================================================================================================
// ［開始日］の［年］変更時の制御
// -------------------------------------------------------------------------------------------------
// 概要　　：［開始日］の［年］変更時に、2月が選択されている場合、［日］の選択肢の更新する。
// 入力値　：無
// 戻り値　：無
// =================================================================================================
function ChangeStartYear() {
// 入力値の取得
	var startYear	= Number(document.getElementsByName("selectStartYear")[0].value);
	var startMonth	= Number(document.getElementsByName("selectStartMonth")[0].value);
	var startDay	= Number(document.getElementsByName("selectStartDay")[0].value);

// 選択されている［月］の確認
	if (startMonth == 2) {
	// 選択されている［月］の末日の取得
		var endSelectStartDay = GetMonthEndDay(startYear, startMonth);

	// 選択されている［日］の確認
		if (startDay == 29) {
		// 選択された［年］がうるう年でないかの確認
			if (endSelectStartDay != 29) {
				startDay = 28;
			}
		}
	// ［開始日］の［日］のリストを更新
		var selectStartDay = document.getElementsByName("selectStartDay")[0];
		RemoveOptionElement(selectStartDay);
		CreateOptionElement(selectStartDay, 1, endSelectStartDay, startDay);
	}
}


// =================================================================================================
// ［開始日］の［月］変更時の制御
// -------------------------------------------------------------------------------------------------
// 概要　　：［開始日］の［月］変更時に［日］の選択肢を更新する。
// 入力値　：無
// 戻り値　：無
// =================================================================================================
function ChangeStartMonth() {
// 入力値の取得
	var startYear	= Number(document.getElementsByName("selectStartYear")[0].value);
	var startMonth	= Number(document.getElementsByName("selectStartMonth")[0].value);
	var startDay	= Number(document.getElementsByName("selectStartDay")[0].value);

// 選択された［月］の末日の取得
	var endSelectStartDay = GetMonthEndDay(startYear, startMonth);

// 選択された［月］の確認
	if (startMonth == 2) {
	// 選択されている［日］の確認
		if ((startDay == 29) || (startDay == 30) || (startDay == 31)) {
		// 選択されている［年］がうるう年かの確認
			if (endSelectStartDay == 28) {
				startDay = 28;
			} else {
				startDay = 29;
			}
		}
	} else {
	// 選択されている［日］の確認
		if (startDay == 31) {
		// 選択された［月］に31日がないかの確認
			if (endSelectStartDay != 31) {
				startDay = 30;
			}
		}
	}

// ［開始日］の［日］のリストを更新
	var selectStartDay = document.getElementsByName("selectStartDay")[0];
	RemoveOptionElement(selectStartDay);
	CreateOptionElement(selectStartDay, 1, endSelectStartDay, startDay);
}


// =================================================================================================
// ［終了日］の［年］変更時の制御
// -------------------------------------------------------------------------------------------------
// 概要　　：［終了日］の［年］変更時に、2月が選択されている場合、［日］の選択肢の更新する。
// 入力値　：無
// 戻り値　：無
// =================================================================================================
function ChangeFinishYear() {
// 入力値の取得
	var finishYear	= Number(document.getElementsByName("selectFinishYear")[0].value);
	var finishMonth	= Number(document.getElementsByName("selectFinishMonth")[0].value);
	var finishDay	= Number(document.getElementsByName("selectFinishDay")[0].value);

// 選択されている［月］の確認
	if (finishMonth == 2) {
	// 選択されている［月］の末日の取得
		var endSelectFinishDay = GetMonthEndDay(finishYear, finishMonth);

	// 選択されている［日］の確認
		if (finishDay == 29) {
		// 選択された［年］がうるう年でないかの確認
			if (endSelectFinishDay != 29) {
				finishDay = 28;
			}
		}
	// ［終了日］の［日］のリストを更新
		var selectFinishDay = document.getElementsByName("selectFinishDay")[0];
		RemoveOptionElement(selectFinishDay);
		CreateOptionElement(selectFinishDay, 1, endSelectFinishDay, finishDay);
	}
}


// =================================================================================================
// ［終了日］の［月］変更時の制御
// -------------------------------------------------------------------------------------------------
// 概要　　：［終了日］の［月］変更時に［日］の選択肢を更新する。
// 入力値　：無
// 戻り値　：無
// =================================================================================================
function ChangeFinishMonth() {
// 入力値の取得
	var finishYear	= Number(document.getElementsByName("selectFinishYear")[0].value);
	var finishMonth	= Number(document.getElementsByName("selectFinishMonth")[0].value);
	var finishDay	= Number(document.getElementsByName("selectFinishDay")[0].value);

// 選択された［月］の末日の取得
	var endSelectFinishDay = GetMonthEndDay(finishYear, finishMonth);

// 選択された［月］の確認
	if (finishMonth == 2) {
	// 選択されている［日］の確認
		if ((finishDay == 29) || (finishDay == 30) || (finishDay == 31)) {
		// 選択されている［年］がうるう年かの確認
			if (endSelectFinishDay == 28) {
				finishDay = 28;
			} else {
				finishDay = 29;
			}
		}
	} else {
	// 選択されている［日］の確認
		if (finishDay == 31) {
		// 選択された［月］に31日がないかの確認
			if (endSelectFinishDay != 31) {
				finishDay = 30;
			}
		}
	}

// ［終了日］の［日］のリストを更新
	var selectFinishDay = document.getElementsByName("selectFinishDay")[0];
	RemoveOptionElement(selectFinishDay);
	CreateOptionElement(selectFinishDay, 1, endSelectFinishDay, finishDay);
}
