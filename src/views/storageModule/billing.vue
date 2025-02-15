<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item label="单据类型" class="redStart">
        <el-select v-model="queryParams.value" placeholder="请选择单据类型" style="width: 240px" clearable>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveQuery">保存</el-button>
        <el-button type="primary" @click="addQuery">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" border empty-text="请添加数据">
      <!-- <el-table-column type="selection" align="center" /> -->
      <el-table-column type="index" width="55" label="序号" align="center" prop="index" />
      <el-table-column label="商品编号" align="center" prop="itemNumber" />
      <el-table-column label="货品名称" align="center" prop="goodsName" />
      <el-table-column label="规格" align="center" prop="specification" />
      <el-table-column label="数量" align="center" prop="num" >
        <template #default="scope">
          <el-input
            v-model="scope.row.num"
            placeholder="请输入"
          />
        </template>
      </el-table-column>
      <el-table-column width="100" label="操作" align="center">
        <template #default="scope">
          <el-link @click="deleteRow(scope.$index)" :underline="false" type="primary" class="margin-right5"
            >删除
          </el-link>
        </template>
      </el-table-column>
    </el-table>
  

    <!-- 添加或修改测试单表对话框 -->
    <el-dialog title="选择商品" v-model="open" width="900px">
      <el-form :model="productParams" ref="queryRef" :inline="true">
        <el-form-item>
          <el-input
            v-model="productParams.testKey"
            placeholder="请输入商品名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="productParams.gg"
            placeholder="请输入规格"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchQuery">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="productList" border @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column type="selection" align="center" width="55"/>
        <el-table-column label="商品编号" width="150" align="center" prop="itemNumber" />
        <el-table-column label="商品名称" align="center" prop="goodsName" />
        <el-table-column label="规格" width="150" align="center" prop="specification" />
        <!-- <el-table-column width="100" label="操作" align="center">
          <template #default="scope">
            <el-link @click="selectRow(scope.row)" :underline="false" type="primary" class="margin-right5"
              >选择
            </el-link>
          </template>
        </el-table-column> -->
      </el-table>
      <pagination
        :total="productList.length"
        v-model:page="productParams.pageNum"
        v-model:limit="productParams.pageSize"
        @pagination="getList"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="open = false">取 消</el-button>
          <el-button type="primary" @click="selectQuery">选 择</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Demo">
import {getToken} from "@/utils/auth";
import { ElMessageBox } from 'element-plus';

const { proxy } = getCurrentInstance();

const list = ref([
  // {
  //   itemNumber: 1258745,
  //   goodsName: '鞋子',
  //   specification: 'L',
  // },
  // {
  //   itemNumber: 7596352,
  //   goodsName: '裤子',
  //   specification: 'xxxL',
  // },
  // {
  //   itemNumber: 8523966,
  //   goodsName: '帽子',
  //   specification: '42',
  // },
  // {
  //   itemNumber: 7868366,
  //   goodsName: '臂章',
  //   specification: '陆军特战旅',
  // },
  // {
  //   itemNumber: 8767243,
  //   goodsName: '衣服',
  //   specification: 'xxL',
  // },
]);

const productList = ref([
  {
    itemNumber: Math.floor(Math.random()*1000000),
    goodsName: '鞋子',
    specification: 'L',
  },
  {
    itemNumber: Math.floor(Math.random()*1000000),
    goodsName: '臂章',
    specification: '陆军特战旅',
  },
  {
    itemNumber: Math.floor(Math.random()*1000000),
    goodsName: '衣服',
    specification: 'xxL',
  },
  {
    itemNumber: Math.floor(Math.random()*1000000),
    goodsName: '臂章',
    specification: '陆军特战旅',
  },
  {
    itemNumber: Math.floor(Math.random()*1000000),
    goodsName: '衣服',
    specification: 'xxL',
  },
  {
    itemNumber: Math.floor(Math.random()*1000000),
    goodsName: '臂章',
    specification: '陆军特战旅',
  },
  {
    itemNumber: Math.floor(Math.random()*1000000),
    goodsName: '衣服',
    specification: 'xxL',
  },
]);

const open = ref(false);
const ids = ref([]);
const total = ref(0);
const value = ref("");
const selectionList = ref([]); // 弹窗勾选数据列表
const options = ref([
  { label: "采购入库",value: 1},
  { label: "销售退回",value: 2},
  { label: "调拨入库",value: 3},  
])
const productParams= ref({
  pageNum: 1,
  pageSize: 10,
  testKey: "",
  gg: "",
})

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    value: "",
  },
  rules: {
    value: [
      { required: true, message: "请先选择单据类型", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询列表 */
function getList() {
  // listDemo().then(response => {
  //   list.value = response.rows;
  //   total.value = response.total;
  // });
}
/** 保存按钮操作 */
function saveQuery() {
  console.log(list.value,list.value.length)
  if(list.value.length <= 0){
    proxy.$modal.msgError('请选择数据！');
    return;
  }
  for (let i = 0; i < list.value.length; i++) {
    if(list.value[i].num == ""){
      proxy.$modal.msgError(`第${i + 1}行数量没有输入！`);
      return;
    }
  }
  console.log(list.value,"list.valuelist.valuelist.value")
  ElMessageBox.confirm('此操作将开单，是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(({ value })=>{
    // planUnpublish({setList:arr}).then(res => {
    // 	if(res.resCode == 200){
    // 		getList();
        list.value = [];
        proxy.$modal.msgSuccess('操作成功');
    // 	}
    // })
  }).catch(() => {});
}

// 添加按钮
function addQuery(){
  if(queryParams.value.value == ""){
    proxy.$modal.msgError("请先选择单据类型");
    return;
  }
  open.value = true;
  proxy.$nextTick(() => {
    if (list.value) {
      list.value.forEach((row) => {
        console.log(row,"*-*-*-*")
        proxy.$refs.multipleTable.toggleRowSelection(row,true);
      });
    } else {
      proxy.$refs.multipleTable.clearSelection();
    }
  });
}

// 删除按钮
function deleteRow(index){
  list.value.splice(index, 1);
}

// 搜索按钮
function searchQuery(){

}

// 重置按钮
function resetQuery(){
  productParams.value = {
    pageNum: 1,
    pageSize: 10,
    testKey: "",
    gg: "",
  }
}




/** 选择条数  */
function handleSelectionChange(selection) {
  selectionList.value = [];
  selectionList.value = selection;
}

// 弹窗选择按钮
function selectQuery(){
  console.log(selectionList.value,"55436543563")
  open.value = false;
  list.value = selectionList.value;
  list.value.forEach(item => {
    item.num = "";
  })
  proxy.$refs.multipleTable.clearSelection();
}
getList()
</script>

<style scoped>
.redStart {
  position: relative;
}
.redStart::after {
  position: absolute;
  top: 50%;
  left: -9px;
  transform: translateY(-50%);
  content: "*";
  color: red;
}
</style>