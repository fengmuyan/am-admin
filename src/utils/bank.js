const bankArr = [
  { bank: "中国工商银行", bankNum: "102100099996" },
  { bank: "中国农业银行股份有限公司", bankNum: "103100000026" },
  { bank: "中国银行总行", bankNum: "104100000004" },
  { bank: "中国建设银行股份有限公司总行", bankNum: "105100000017" },
  { bank: "交通银行", bankNum: "301290000007" },
  { bank: "中信银行股份有限公司", bankNum: "302100011000" },
  { bank: "中国光大银行", bankNum: "303100000006" },
  { bank: "华夏银行股份有限公司总行", bankNum: "304100040000" },
  { bank: "中国民生银行", bankNum: "305100000013" },
  { bank: "广发银行股份有限公司", bankNum: "306581000003" },
  { bank: "平安银行（原深圳发展银行）", bankNum: "307584007998" },
  { bank: "招商银行股份有限公司", bankNum: "308584000013" },
  { bank: "兴业银行总行", bankNum: "309391000011" },
  { bank: "上海浦东发展银行", bankNum: "310290000013" },
  { bank: "北京银行", bankNum: "313100000013" },
  { bank: "天津银行股份有限公司", bankNum: "313110000017" },
  { bank: "河北银行股份有限公司", bankNum: "313121006888" },
  { bank: "唐山银行股份有限公司", bankNum: "313124000018" },
  { bank: "邯郸市商业银行股份有限公司", bankNum: "313127000013" },
  { bank: "邢台银行股份有限公司", bankNum: "313131000016" },
  { bank: "保定银行股份有限公司", bankNum: "313134000011" },
  { bank: "张家口银行股份有限公司", bankNum: "313138000019" },
  { bank: "承德银行股份有限公司", bankNum: "313141052422" },
  { bank: "沧州银行", bankNum: "313143005157" },
  { bank: "廊坊银行股份有限公司", bankNum: "313146000019" },
  { bank: "衡水银行股份有限公司", bankNum: "313148053964" },
  { bank: "晋商银行股份有限公司", bankNum: "313161000017" },
  { bank: "晋城银行", bankNum: "313168000003" },
  { bank: "晋中银行", bankNum: "313175000011" },
  { bank: "内蒙古银行", bankNum: "313191000011" },
  { bank: "包商银行股份有限公司", bankNum: "313192000013" },
  { bank: "乌海银行股份有限公司", bankNum: "313193057846" },
  { bank: "鄂尔多斯银行股份有限公司", bankNum: "313205057830" },
  { bank: "盛京银行清算中心", bankNum: "313221030008" },
  { bank: "大连银行", bankNum: "313222080002" },
  { bank: "鞍山市商业银行", bankNum: "313223007007" },
  { bank: "丹东银行清算中心", bankNum: "313226009000" },
  { bank: "锦州银行", bankNum: "313227000012" },
  { bank: "葫芦岛银行股份有限公司", bankNum: "313227600018" },
  { bank: "营口银行股份有限公司资金清算中心", bankNum: "313228000276" },
  { bank: "营口沿海银行股份有限公司", bankNum: "313228060009" },
  { bank: "阜新银行结算中心", bankNum: "313229000008" },
  { bank: "辽阳银行", bankNum: "313231000013" },
  { bank: "朝阳银行股份有限公司", bankNum: "313234001089" },
  { bank: "吉林银行", bankNum: "313241066661" },
  { bank: "哈尔滨银行结算中心", bankNum: "313261000018" },
  { bank: "龙江银行股份有限公司", bankNum: "313261099913" },
  { bank: "南京银行股份有限公司", bankNum: "313301008887" },
  { bank: "江苏银行股份有限公司", bankNum: "313301099999" },
  { bank: "苏州银行股份有限公司", bankNum: "313305066661" },
  { bank: "江苏长江商业银行", bankNum: "313312300018" },
  { bank: "杭州银行股份有限公司", bankNum: "313331000014" },
  { bank: "宁波银行股份有限公司", bankNum: "313332082914" },
  { bank: "宁波通商银行股份有限公司", bankNum: "313332090019" },
  { bank: "温州银行股份有限公司", bankNum: "313333007331" },
  { bank: "嘉兴银行股份有限公司清算中心(不对外办理业务)", bankNum: "313335081005" },
  { bank: "湖州银行股份有限公司", bankNum: "313336071575" },
  { bank: "绍兴银行股份有限公司营业部", bankNum: "313337009004" },
  { bank: "金华银行股份有限公司", bankNum: "313338009688" },
  { bank: "浙江稠州商业银行", bankNum: "313338707013" },
  { bank: "台州银行股份有限公司", bankNum: "313345001665" },
  { bank: "浙江泰隆商业银行", bankNum: "313345010019" },
  { bank: "浙江民泰商业银行", bankNum: "313345400010" },
  { bank: "福建海峡银行股份有限公司", bankNum: "313391080007" },
  { bank: "厦门银行股份有限公司", bankNum: "313393080005" },
  { bank: "泉州银行股份有限公司", bankNum: "313397075189" },
  { bank: "江西银行股份有限公司", bankNum: "313421087506" },
  { bank: "九江银行股份有限公司", bankNum: "313424076706" },
  { bank: "赣州银行股份有限公司", bankNum: "313428076517" },
  { bank: "上饶银行", bankNum: "313433076801" },
  { bank: "齐鲁银行", bankNum: "313451000019" },
  { bank: "青岛银行", bankNum: "313452060150" },
  { bank: "齐商银行", bankNum: "313453001017" },
  { bank: "枣庄银行股份有限公司", bankNum: "313454000016" },
  { bank: "东营银行股份有限公司", bankNum: "313455000018" },
  { bank: "烟台银行股份有限公司", bankNum: "313456000108" },
  { bank: "潍坊银行", bankNum: "313458000013" },
  { bank: "济宁银行股份有限公司", bankNum: "313461000012" },
  { bank: "泰安银行股份有限公司", bankNum: "313463000993" },
  { bank: "莱商银行", bankNum: "313463400019" },
  { bank: "威海市商业银行", bankNum: "313465000010" },
  { bank: "德州银行股份有限公司", bankNum: "313468000015" },
  { bank: "临商银行股份有限公司", bankNum: "313473070018" },
  { bank: "日照银行股份有限公司", bankNum: "313473200011" },
  { bank: "郑州银行", bankNum: "313491000232" },
  { bank: "中原银行股份有限公司", bankNum: "313491099996" },
  { bank: "洛阳银行股份有限公司", bankNum: "313493080539" },
  { bank: "平顶山银行股份有限公司", bankNum: "313495081900" },
  { bank: "焦作中旅银行股份有限公司", bankNum: "313501080608" },
  { bank: "汉口银行资金清算中心", bankNum: "313521000011" },
  { bank: "湖北银行股份有限公司", bankNum: "313521006000" },
  { bank: "华融湘江银行股份有限公司", bankNum: "313551070008" },
  { bank: "长沙银行股份有限公司", bankNum: "313551088886" },
  { bank: "广州银行", bankNum: "313581003284" },
  { bank: "珠海华润银行股份有限公司清算中心", bankNum: "313585000990" },
  { bank: "广东华兴银行股份有限公司", bankNum: "313586000006" },
  { bank: "广东南粤银行股份有限公司", bankNum: "313591001001" },
  { bank: "东莞银行股份有限公司", bankNum: "313602088017" },
  { bank: "广西北部湾银行", bankNum: "313611001018" },
  { bank: "柳州银行股份有限公司清算中心", bankNum: "313614000012" },
  { bank: "桂林银行股份有限公司", bankNum: "313617000018" },
  { bank: "海南银行股份有限公司", bankNum: "313641099995" },
  { bank: "成都银行", bankNum: "313651099999" },
  { bank: "重庆银行", bankNum: "313653000013" },
  { bank: "自贡银行股份有限公司", bankNum: "313655091983" },
  { bank: "攀枝花市商业银行", bankNum: "313656000019" },
  { bank: "泸州市商业银行", bankNum: "313657092617" },
  { bank: "长城华西银行股份有限公司", bankNum: "313658000014" },
  { bank: "绵阳市商业银行", bankNum: "313659000016" },
  { bank: "遂宁银行股份有限公司", bankNum: "313662000015" },
  { bank: "乐山市商业银行", bankNum: "313665092924" },
  { bank: "宜宾市商业银行", bankNum: "313671000017" },
  { bank: "四川天府银行股份有限公司", bankNum: "313673093259" },
  { bank: "贵阳市商业银行", bankNum: "313701098010" },
  { bank: "贵州银行股份有限公司", bankNum: "313701099012" },
  { bank: "富滇银行股份有限公司运营管理部", bankNum: "313731010015" },
  { bank: "曲靖市商业银行", bankNum: "313736000019" },
  { bank: "云南红塔银行股份有限公司", bankNum: "313741095715" },
  { bank: "西安银行股份有限公司", bankNum: "313791000015" },
  { bank: "长安银行股份有限公司", bankNum: "313791030003" },
  { bank: "兰州银行股份有限公司", bankNum: "313821001016" },
  { bank: "甘肃银行股份有限公司", bankNum: "313821050016" },
  { bank: "青海银行股份有限公司营业部", bankNum: "313851000018" },
  { bank: "宁夏银行总行清算中心", bankNum: "313871000007" },
  { bank: "石嘴山银行股份有限公司", bankNum: "313872097457" },
  { bank: "乌鲁木齐银行清算中心", bankNum: "313881000002" },
  { bank: "昆仑银行股份有限公司", bankNum: "313882000012" },
  { bank: "新疆汇和银行股份有限公司（清算行）", bankNum: "313898100016" },
  { bank: "天津滨海农村商业银行股份有限公司", bankNum: "314110000011" },
  { bank: "无锡农村商业银行股份有限公司（不对外）", bankNum: "314302066666" },
  { bank: "江苏江阴农村商业银行股份有限公司", bankNum: "314302200018" },
  { bank: "江苏江南农村商业银行股份有限公司(不对外)", bankNum: "314304099999" },
  { bank: "太仓农村商业银行", bankNum: "314305106644" },
  { bank: "昆山农村商业银行", bankNum: "314305206650" },
  { bank: "吴江农村商业银行清算中心", bankNum: "314305400015" },
  { bank: "江苏常熟农村商业银行股份有限公司清算中心", bankNum: "314305506621" },
  { bank: "张家港农村商业银行", bankNum: "314305670002" },
  { bank: "广州农村商业银行股份有限公司", bankNum: "314581000011" },
  { bank: "佛山顺德农村商业银行股份有限公司", bankNum: "314588000016" },
  { bank: "海口联合农村商业银行股份有限公司", bankNum: "314641000014" },
  { bank: "成都农商银行", bankNum: "314651000000" },
  { bank: "重庆农村商业银行股份有限公司", bankNum: "314653000011" },
  { bank: "恒丰银行", bankNum: "315456000105" },
  { bank: "浙商银行", bankNum: "316331000018" },
  { bank: "天津农村商业银行股份有限公司", bankNum: "317110010019" },
  { bank: "渤海银行股份有限公司", bankNum: "318110000014" },
  { bank: "徽商银行股份有限公司", bankNum: "319361000013" },
  { bank: "北京顺义银座村镇银行股份有限公司", bankNum: "320100010011" },
  { bank: "北京昌平包商村镇银行股份有限公司", bankNum: "320100018169" },
  { bank: "北京怀柔融兴村镇银行有限责任公司", bankNum: "320100023015" },
  { bank: "天津津南村镇银行股份有限公司", bankNum: "320110000028" },
  { bank: "清徐惠民村镇银行有限责任公司", bankNum: "320161006008" },
  { bank: "内蒙古和林格尔包商村镇银行有限责任公司", bankNum: "320191003012" },
  { bank: "固阳包商村镇银行股份有限公司", bankNum: "320192200018" },
  { bank: "宁城包商村镇银行有限责任公司", bankNum: "320194800017" },
  { bank: "莫力达瓦包商村镇银行有限责任公司", bankNum: "320196601004" },
  { bank: "兴安盟科尔沁包商村镇银行有限公司", bankNum: "320198000017" },
  { bank: "西乌珠穆沁包商惠丰村镇银行有限责任公司", bankNum: "320201700012" },
  { bank: "乌兰察布市集宁包商村镇银行有限责任公司", bankNum: "320203000109" },
  { bank: "化德包商村镇银行有限责任公司", bankNum: "320203600016" },
  { bank: "准格尔旗包商村镇银行有限责任公司", bankNum: "320205300017" },
  { bank: "乌审旗包商村镇银行有限责任公司", bankNum: "320205700011" },
  { bank: "大连金州联丰村镇银行股份有限公司", bankNum: "320222000014" },
  { bank: "九台龙嘉村镇银行股份有限公司", bankNum: "320241000010" },
  { bank: "榆树融兴村镇银行", bankNum: "320241017017" },
  { bank: "巴彦融兴村镇银行有限责任公司", bankNum: "320261020018" },
  { bank: "延寿融兴村镇银行有限责任公司", bankNum: "320261052015" },
  { bank: "拜泉融兴村镇银行有限责任公司", bankNum: "320265205014" },
  { bank: "桦川融兴村镇银行有限责任公司", bankNum: "320272338019" },
  { bank: "江苏惠山民泰村镇银行股份有限公司", bankNum: "320302000014" },
  { bank: "江苏南通如皋包商村镇银行股份有限公司", bankNum: "320306200013" },
  { bank: "江苏如东融兴村镇银行有限责任公司", bankNum: "320306303012" },
  { bank: "江苏邗江民泰村镇银行股份有限公司", bankNum: "320312091015" },
  { bank: "江苏仪征包商村镇银行有限责任公司", bankNum: "320312900017" },
  { bank: "宁波市海曙国民村镇银行有限责任公司", bankNum: "320332000015" },
  { bank: "象山国民村镇银行股份有限公司", bankNum: "320332100016" },
  { bank: "浙江景宁银座村镇银行股份有限公司", bankNum: "320343800019" },
  { bank: "浙江龙泉民泰村镇银行股份有限公司", bankNum: "320343900011" },
  { bank: "浙江三门银座村镇银行股份有限公司", bankNum: "320345790018" },
  { bank: "安义融兴村镇银行有限责任公司", bankNum: "320421007514" },
  { bank: "乐平融兴村镇银行有限责任公司", bankNum: "320422100011" },
  { bank: "江西赣州银座村镇银行股份有限公司", bankNum: "320428090311" },
  { bank: "东营莱商村镇银行股份有限公司", bankNum: "320455000019" },
  { bank: "鄄城包商村镇银行有限责任公司", bankNum: "320475918197" },
  { bank: "偃师融兴村镇银行有限责任公司", bankNum: "320493107012" },
  { bank: "新安融兴村镇银行有限责任公司", bankNum: "320493302510" },
  { bank: "漯河市郾城包商村镇银行有限责任公司", bankNum: "320504000014" },
  { bank: "湖北荆门掇刀包商村镇银行股份有限公司", bankNum: "320532000013" },
  { bank: "应城融兴村镇银行有限责任公司", bankNum: "320535204511" },
  { bank: "洪湖融兴村镇银行有限责任公司", bankNum: "320537303517" },
  { bank: "株洲县融兴村镇银行有限责任公司", bankNum: "320552105518" },
  { bank: "耒阳融兴村镇银行有限责任公司", bankNum: "320554706519" },
  { bank: "武冈包商村镇银行有限责任公司", bankNum: "320555600014" },
  { bank: "深圳宝安融兴村镇银行有限责任公司", bankNum: "320584001000" },
  { bank: "深圳福田银座村镇银行股份有限公司", bankNum: "320584002002" },
  { bank: "广西上林国民村镇银行有限责任公司", bankNum: "320611000067" },
  { bank: "广西银海国民村镇银行有限责任公司", bankNum: "320623000015" },
  { bank: "合浦国民村镇银行有限责任公司", bankNum: "320623100016" },
  { bank: "平果国民村镇银行有限责任公司", bankNum: "320626400049" },
  { bank: "广西钦州市钦南国民村镇银行有限责任公司", bankNum: "320631100016" },
  { bank: "广西浦北国民村镇银行有限责任公司", bankNum: "320631500019" },
  { bank: "防城港防城国民村镇银行有限责任公司", bankNum: "320633000027" },
  { bank: "东兴国民村镇银行有限责任公司", bankNum: "320633100011" },
  { bank: "海南保亭融兴村镇银行有限责任公司", bankNum: "320641008517" },
  { bank: "新都桂城村镇银行有限责任公司", bankNum: "320651012005" },
  { bank: "重庆渝北银座村镇银行股份有限公司", bankNum: "320653000104" },
  { bank: "重庆九龙坡民泰村镇银行股份有限公司", bankNum: "320653000137" },
  { bank: "重庆市沙坪坝融兴村镇银行有限责任公司", bankNum: "320653000153" },
  { bank: "重庆市大渡口融兴村镇银行有限责任公司", bankNum: "320653056012" },
  { bank: "广元市包商贵民村镇银行有限责任公司", bankNum: "320661300010" },
  { bank: "遂宁安居融兴村镇银行有限责任公司", bankNum: "320662047017" },
  { bank: "武隆融兴村镇银行有限责任公司", bankNum: "320669509516" },
  { bank: "重庆黔江银座村镇银行股份有限公司", bankNum: "320687000016" },
  { bank: "重庆市酉阳融兴村镇银行有限责任公司", bankNum: "320687400019" },
  { bank: "重庆彭水民泰村镇银行股份有限公司", bankNum: "320687500011" },
  { bank: "息烽包商黔隆村镇银行有限责任公司", bankNum: "320701000011" },
  { bank: "贵阳花溪建设村镇银行有限责任公司", bankNum: "320701000038" },
  { bank: "毕节发展村镇银行有限责任公司", bankNum: "320709000026" },
  { bank: "会宁会师村镇银行有限责任公司", bankNum: "320824275019" },
  { bank: "宁夏贺兰回商村镇银行有限责任公司", bankNum: "320871000018" },
  { bank: "新疆绿洲国民村镇银行有限责任公司", bankNum: "320881000011" },
  { bank: "克拉玛依金龙国民村镇银行有限责任公司", bankNum: "320882000013" },
  { bank: "哈密红星国民村镇银行有限责任公司", bankNum: "320884000025" },
  { bank: "北屯国民村镇银行有限责任公司", bankNum: "320884400011" },
  { bank: "昌吉国民村镇银行有限责任公司", bankNum: "320885099990" },
  { bank: "五家渠国民村镇银行有限责任公司", bankNum: "320885800018" },
  { bank: "博乐国民村镇银行有限责任公司", bankNum: "320887000014" },
  { bank: "库车国民村镇银行有限责任公司", bankNum: "320891300000" },
  { bank: "伊犁国民村镇银行有限责任公司", bankNum: "320898000010" },
  { bank: "奎屯国民村镇银行有限责任公司", bankNum: "320898100019" },
  { bank: "石河子国民村镇银行有限责任公司", bankNum: "320902800016" },
  { bank: "重庆三峡银行股份有限公司", bankNum: "321667090019" },
  { bank: "上海农村商业银行", bankNum: "322290000011" },
  { bank: "上海华瑞银行", bankNum: "323290000016" },
  { bank: "浙江网商银行股份有限公司", bankNum: "323331000001" },
  { bank: "温州民商银行股份有限公司", bankNum: "323333000013" },
  { bank: "深圳前海微众银行股份有限公司", bankNum: "323584000888" },
  { bank: "四川新网银行股份有限公司", bankNum: "323651066666" },
  { bank: "重庆富民银行股份有限公司", bankNum: "323653010015" },
  { bank: "上海银行股份有限公司", bankNum: "325290000012" },
  { bank: "北京农村商业银行股份有限公司", bankNum: "402100000018" },
  { bank: "内蒙古自治区农村信用社联合社", bankNum: "402191009992" },
  { bank: "辽宁省农村信用社联合社运营管理部", bankNum: "402221010013" },
  { bank: "吉林省农村信用社联合社（不办理转汇业务）", bankNum: "402241000015" },
  { bank: "江苏省农村信用社联合社", bankNum: "402301099998" },
  { bank: "浙江省农村信用社联合社", bankNum: "402331000007" },
  { bank: "宁波鄞州农村合作银行", bankNum: "402332010004" },
  { bank: "安徽省农村信用联社资金清算中心", bankNum: "402361018886" },
  { bank: "福建省农村信用社联合社", bankNum: "402391000068" },
  { bank: "江西省农村信用社联合社", bankNum: "402421099990" },
  { bank: "山东省农村信用社联合社", bankNum: "402451000010" },
  { bank: "河南省农村信用社联合社", bankNum: "402491000026" },
  { bank: "湖北省农村信用社联合社结算中心", bankNum: "402521000032" },
  { bank: "武汉农村商业银行股份有限公司", bankNum: "402521090019" },
  { bank: "广东省农村信用社联合社", bankNum: "402581090008" },
  { bank: "深圳农村商业银行股份有限公司", bankNum: "402584009991" },
  { bank: "东莞农村商业银行股份有限公司", bankNum: "402602000018" },
  { bank: "广西壮族自治区农村信用社联合社", bankNum: "402611099974" },
  { bank: "海南省农村信用社联合社资金清算中心", bankNum: "402641000014" },
  { bank: "四川省农村信用社联合社", bankNum: "402651020006" },
  { bank: "贵州省农村信用社联合社", bankNum: "402701002999" },
  { bank: "云南省农村信用社联合社", bankNum: "402731057238" },
  { bank: "陕西省农村信用社联合社资金清算中心", bankNum: "402791000010" },
  { bank: "宁夏黄河农村商业银行股份有限公司", bankNum: "402871099996" },
  { bank: "中国邮政储蓄银行有限责任公司", bankNum: "403100000004" },
  { bank: "汇丰银行(中国)有限公司上海分行", bankNum: "501290000012" },
  { bank: "东亚银行（中国）有限公司", bankNum: "502290000006" },
  { bank: "花旗银行(中国)有限公司", bankNum: "531290088881" },
  { bank: "友利银行(中国)有限公司", bankNum: "593100000020" },
  { bank: "新韩银行（中国）有限公司", bankNum: "595100000007" },
  { bank: "企业银行（中国）有限公司", bankNum: "596110000013" },
  { bank: "韩亚银行（中国）有限公司", bankNum: "597100000014" },
  { bank: "中德住房储蓄银行", bankNum: "717110000010" },
  { bank: "厦门国际银行股份有限公司", bankNum: "781393010011" },
  { bank: "富邦华一银行有限公司", bankNum: "787290000019" }
]
export default bankArr