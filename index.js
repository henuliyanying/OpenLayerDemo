function getSearchCondition() {
	alert("点击检索按钮");
}
function init(){
	alert("点击自定义");
	$('#startDate').val("");
	$('#endDate').val("");
}
$(function() {
	$("#caijiTime").click(function() {
		/* var value = $("input[type=radio]:checked").val(); */
		var value = $("input[name=time]:checked").val();
		switch (value) {
		case "1": // 设置为可用
			$('#startDate').prop("disabled", false);
			$('#endDate').prop("disabled", false);
			document.getElementById("startDate").style.cursor="pointer";
			document.getElementById("endDate").style.cursor="pointer";
			break;
		case "2": // 设置为今天
			var curDate = getNowFormatDate();
			console.log("curDate:"+curDate);
			$('#startDate').val(curDate);
			$('#endDate').val(curDate);
			$('#startDate').prop("disabled", true);
			$('#endDate').prop("disabled", true);
			document.getElementById("startDate").style.cursor="";
			document.getElementById("endDate").style.cursor="";
			break;
		case "3":// 设置为今天及前6天
			var curDate = getNowFormatDate();
			var beforeWeekDate = getBeforeDays(curDate, 6);
			$('#startDate').val(beforeWeekDate);
			$('#endDate').val(curDate);
			$('#startDate').prop("disabled", true);
			$('#endDate').prop("disabled", true);
			document.getElementById("startDate").style.cursor="";
			document.getElementById("endDate").style.cursor="";
			break;
		case "4":// 设置为今天及前29天
			var curDate = getNowFormatDate();
			var beforeWeekDate = getBeforeDays(curDate, 29);
			$('#startDate').val(beforeWeekDate);
			$('#endDate').val(curDate);
			$('#startDate').prop("disabled", true);
			$('#endDate').prop("disabled", true);
			document.getElementById("startDate").style.cursor="";
			document.getElementById("endDate").style.cursor="";
			break;
		case "5":// 设置日期为------，代表全部
			$('#startDate').val("");
			$('#endDate').val("");
			$('#startDate').prop("disabled", true);
			$('#endDate').prop("disabled", true);
			document.getElementById("startDate").style.cursor="";
			document.getElementById("endDate").style.cursor="";
			break;
		}
	});
});
// 获取当前日期方法
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate;
	return currentdate;
}
// 获取指定日期（d）的前(num+1)天
function getBeforeDays(d, num) {
	d = new Date(d);
	d = +d - 1000 * 60 * 60 * 24 * num;
	d = new Date(d);
	var year = d.getFullYear();
	var mon = d.getMonth() + 1;
	var day = d.getDate();
	s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-"
			+ (day < 10 ? ('0' + day) : day);
	return s;
}
$(function() {
	// 设置日期范围，结束时间 >= 开始时间
	var startDate = laydate.render({
		elem : '#startDate',
		format : 'yyyy-MM-dd',
		done : function(value, date) {
			endDate.config.min = {
				year : date.year,
				month : date.month - 1,
				date : date.date,
			};
			endDate.config.start = {
				year : date.year,
				month : date.month - 1,
				date : date.date,
			};
		}
	});
	var endDate = laydate.render({
		elem : '#endDate',
		format : 'yyyy-MM-dd',
		done : function(value, date) {
			startDate.config.max = {
				year : date.year,
				month : date.month - 1,
				date : date.date,
			}
		}
	});
});

// 获取省市县的WKT值
function getProvinceCityCounty() {
	var province = $("#province option:selected").attr("data-code");// 省
	var city = $("#city option:selected").attr("data-code");// 市
	var county = $("#county option:selected").attr("data-code");// 县
	console.log("province_code：" + province + " city_code:" + city
			+ " county_code:" + county);
	// 提交data-code给数据库，获取WKT

	// Ajax动态提交数据到后台
	$.ajax({
				type : 'post',
				url : '#',// 后台的接口url
				async : true,// 或false,是否异步
				dataType : 'json', // 表示返回值的数据类型，json/xml/html/script/jsonp/text
				contentType : 'application/json;charset=UTF-8', // 内容类型
				traditional : true, // 使json格式的字符串不会被转码
				data : JSON.stringify({
					province : province,
					city : city,
					county : county
				}),
				success : function(result_divisionRegion) {
					showloading(false);
					hideModal();
					console.log("获取省市县的WKT值:" + result_divisionRegion);

					// 处理后台获取的jsonObject对象
					var result_status = result_divisionRegion["result"];
					var dataResult_status;

					if (result_status == true) {
						dataResult_status = result_divisionRegion["data"]["success"];
						if (dataResult_status == true) {
							// debugger;
							var result = result_divisionRegion["data"]["table"];

							$.each(result, function(index, item) {
								region_value = item.wkt;// 行政区域的WKT值
								
								region = region_value;
								if (province != "" && city == ""
										&& county == "") {
									drawBorder(region);
								}
								if (province != "" && city != ""
										&& county == "") {
									drawBorder(region);
								}
								if (province != "" && city != ""
										&& county != "") {
									drawBorder(region);
								}
							});

						} else if (dataResult_status == false) {
							
							
							var dataResult_message = result_divisionRegion["data"]["message"];

							$("#divisionRegionStatusTable tbody").empty();// 清空表格

							dataResult_message = $("<tr><td>"
									+ " 检索成功！未检索到数据！！！" + "</td></tr>"
									+ "<tr><td align='left'>" + '数据库返回原因：'
									+ dataResult_message + "</td></tr>");

							$("#divisionRegionStatusTable tbody").append(
									dataResult_message);
							// 检索成功！未检索到数据！！！--模态框
							$("#divisionRegionStatusModal").modal({
								backdrop : "static"
							});
							document.getElementById("b1").disabled=true;
							document.getElementById("b2").disabled=true;
							document.getElementById("b3").disabled=true;
							document.getElementById("b4").disabled=true;
							document.getElementById("buttonPrior").disabled=true;
							document.getElementById("buttonList").disabled=true;
							document.getElementById("buttonChecked").disabled=true;
						}
					} else if (result_status == false) {
						$("#level3_5ProductSearchStatusTable tbody").empty();// 清空表格

						dataResult_status = result_divisionRegion["data"];
						dataResult_status = $("<tr><td>" + " 检索失败！"
								+ "</td></tr>" + "<tr><td align='left'>"
								+ '检索失败原因：' + dataResult_status + "</td></tr>");

						$("#level3_5ProductSearchStatusTable tbody").append(
								dataResult_status);

						// 检索状态--失败！！！--模态框
						$("#level3_5ProductSearchStatusModal").modal({
							backdrop : "static"
						});
					}
				}
			});
	return region;
}
function fileInput(){
	alert("文件上传事件");
}
