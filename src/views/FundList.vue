<template>
  <div class="fillcontain">
    <div>
      <el-form
        :inline="true"
        ref="search_data"
        :model='search_data'>
        <el-form-item label="通过时间筛选:">
          <el-date-picker
            v-model="search_data.startTime"
            type="datetime"
            placeholder="选择开始时间">
          </el-date-picker> &#45;&#45;
          <el-date-picker
            v-model="search_data.endTime"
            type="datetime"
            placeholder="选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="search" @click='handleSearch()'>筛选</el-button>
        </el-form-item>
        <el-form-item class="btnRight">
          <el-button type="primary" size="small" icon="view" @click='handleAdd()'>添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table
        v-if="tableData.length > 0"
        :data='tableData'
        max-height="450"
        stripe
        :default-sort="{prop: 'date', order: 'descending'}"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="70">
        </el-table-column>
        <el-table-column
          prop="date"
          label="创建时间"
          align="center"
          width="250"
          sortable>
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="收支类型"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="describe"
          label="收支描述"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="income"
          label="收入"
          align="center"
          width="170">
          <template slot-scope="scope">
            <span style="color: #00d053">{{ scope.row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="expend"
          label="支出"
          align="center"
          width="170">
          <template slot-scope="scope">
            <span style="color: #f56767">{{ scope.row.expend }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cash"
          label="账户现金"
          align="center"
          width="170">
          <template slot-scope="scope">
            <span style="color: #4db3ff">{{ scope.row.cash }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
          width="220">
        </el-table-column>
        <el-table-column
          prop="operation"
          align="center"
          label="操作"
          fixed="right"
          width="180">
          <template slot-scope="scope">
            <el-button
              type="warning"
              size="small"
              icon="edit"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              icon="delete"
              v-if="user.identity === 'manager'"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              v-if='paginations.total > 0'
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total"
              :current-page.sync='paginations.page_index'
              @current-change='handleCurrentChange'
              @size-change='handleSizeChange'>
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <dialog-fund :dialog="dialog" :form="form" @update="getProfile()"></dialog-fund>
  </div>
</template>

<script>
  import DialogFund from '../components/DialogFund'

  export default {
    name: "FundList",
    data() {
      return {
        tableData: [],
        allTableData: [],
        allFilterData: [],
        dialog: {
          show: false,
          title: '',
          option: 'edit'
        },
        form: {
          type: '',
          describe: '',
          income: '',
          expend: '',
          cash: '',
          remark: '',
          id: ''
        },
        search_data: {
          startTime: '',
          endTime: ''
        },
        paginations: {
          total: 0, // 总条数
          page_index: 1, //当前页
          page_size: 5, // 默认一页显示5条
          page_sizes: [5, 10, 15, 20], //每页显示条数选项
          layout: 'total, sizes, prev, pager, next, jumper'
        }
      }
    },
    created() {
      this.getProfile();
    },
    computed: {
      user() {
        return this.$store.getters.user;
      }
    },
    methods: {
      getProfile() {
        this.$axios.get('/api/profiles')
          .then(res => {
            this.allTableData = res.data;
            this.allFilterData = res.data;
            this.setPaginations();
          })
          .catch(err => {
            console.log(err)
          })
      },
      //编辑
      handleEdit(index, row) {
        this.dialog = {
          show: true,
          title: '修改购物清单',
          option: 'edit'
        };
        this.form = {
          type: row.type,
          describe: row.describe,
          income: row.income,
          expend: row.expend,
          cash: row.cash,
          remark: row.remark,
          id: row._id
        };
      },
      //删除
      handleDelete(index, row) {
        this.$axios.delete(`/api/profiles/delete/${row._id}`)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.getProfile();
          })
      },
      handleAdd() {
        this.dialog = {
          show: true,
          title: '添加购物清单',
          option: 'add'
        };
        this.form = {
          type: '',
          describe: '',
          income: '',
          expend: '',
          cash: '',
          remark: '',
          id: ''
        };
      },
      //分页
      setPaginations() {
        //设置默认属性
        this.paginations.total = this.allTableData.length;
        this.paginations.page_size = 5;
        this.paginations.page_index = 1;
        //设置展示数据
        this.tableData = this.allTableData.filter((data, index) => {
          return index < this.paginations.page_size;
        })
      },
      handleCurrentChange(page) {
        //page为将要访问的页数
        //当前页最后一条数据的序号
        let pageLastIndex = this.paginations.page_size * (page - 1);
        //将要访问的页面最后一条数据的序号
        let nums = this.paginations.page_size * page;

        let tables = [];

        for (let i = pageLastIndex; i < nums; i++) {
          if (this.allTableData[i]) {
            tables.push(this.allTableData[i]);
          }
        }
        this.tableData = tables;
      },
      handleSizeChange(size) {
        this.paginations.page_index = 1;
        this.paginations.page_size = size;
        this.tableData = this.allTableData.filter((data, index) => {
          return index < size;
        })
      },
      //筛选
      handleSearch() {
        if (!this.search_data.startTime || !this.search_data.endTime) {
          this.$message({
            type: 'warning',
            message: '请选择时间区间'
          });
          return;
        }
        const sTime = this.search_data.startTime.getTime();
        const eTime = this.search_data.endTime.getTime();

        this.allTableData = this.allFilterData.filter(item => {
          let date = new Date(item.date);
          let time = date.getTime();
          return time >= sTime && time <= eTime;
        });
        this.setPaginations();
      }
    },
    components: {
      DialogFund
    }
  }
</script>

<style scoped>
  .fillcontain {
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
  }

  .btnRight {
    float: right;
  }

  .pagination {
    text-align: right;
    margin-top: 10px;
  }
</style>