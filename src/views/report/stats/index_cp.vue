<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="模板名称" prop="ricReportEnname">
        <el-input
          v-model="queryParams.ricReportEnname"
          placeholder="请输入模板名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['report:report:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['report:report:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['report:report:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['report:report:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="reportList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="模板名称" align="center" prop="ricReportEnname" />-->
      <el-table-column label="报表名称" align="center" prop="ricReportChsname" />
<!--      <el-table-column label="存储过程名称" align="center" prop="ricProcedureName" />
      <el-table-column label="报表类型" align="center" prop="ricTableType" />
      <el-table-column label="统计类型" align="center" prop="ricStatType" />
      <el-table-column label="常用标识" align="center" prop="ricNormalFlag" />
      <el-table-column label="是否启用" align="center" prop="ricActiveFlag" />
      <el-table-column label="是否允许跨月" align="center" prop="ricExtendMonth" />
      <el-table-column label="备注" align="center" prop="REMARKS" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['report:report:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['report:report:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改报表配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="主键" prop="ID">
          <el-input v-model="form.ID" placeholder="请输入主键" />
        </el-form-item>
        <el-form-item label="模板名称" prop="ricReportEnname">
          <el-input v-model="form.ricReportEnname" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="报表名称" prop="ricReportChsname">
          <el-input v-model="form.ricReportChsname" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="存储过程名称" prop="ricProcedureName">
          <el-input v-model="form.ricProcedureName" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="常用标识" prop="ricNormalFlag">
          <el-input v-model="form.ricNormalFlag" placeholder="请输入常用标识" />
        </el-form-item>
        <el-form-item label="是否启用" prop="ricActiveFlag">
          <el-input v-model="form.ricActiveFlag" placeholder="请输入是否启用" />
        </el-form-item>
        <el-form-item label="是否允许跨月" prop="ricExtendMonth">
          <el-input v-model="form.ricExtendMonth" placeholder="请输入是否允许跨月" />
        </el-form-item>
        <el-form-item label="备用字段1" prop="ricAdd1">
          <el-input v-model="form.ricAdd1" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备用字段2" prop="ricAdd2">
          <el-input v-model="form.ricAdd2" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备用字段3" prop="ricAdd3">
          <el-input v-model="form.ricAdd3" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备用字段4" prop="ricAdd4">
          <el-input v-model="form.ricAdd4" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备用字段5" prop="ricAdd5">
          <el-input v-model="form.ricAdd5" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="REMARKS">
          <el-input v-model="form.REMARKS" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="删除标记" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标记" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listReport, getReport, delReport, addReport, updateReport } from "@/api/report/stats";

export default {
  name: "Report",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 报表配置表格数据
      reportList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ricReportEnname: null,
        ricReportChsname: null,
        ricProcedureName: null,
        ricTableType: null,
        ricStatType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询报表配置列表 */
    getList() {
      this.loading = true;
      listReport(this.queryParams).then(response => {
        this.reportList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        ID: null,
        ricReportEnname: null,
        ricReportChsname: null,
        ricProcedureName: null,
        ricTableType: null,
        ricStatType: null,
        ricNormalFlag: null,
        ricActiveFlag: null,
        ricExtendMonth: null,
        ricAdd1: null,
        ricAdd2: null,
        ricAdd3: null,
        ricAdd4: null,
        ricAdd5: null,
        createBy: null,
        createTime: null,
        updateTime: null,
        updateBy: null,
        REMARKS: null,
        delFlag: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.ID)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加报表配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ID = row.ID || this.ids
      getReport(ID).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改报表配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.ID != null) {
            updateReport(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addReport(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const IDs = row.ID || this.ids;
      this.$modal.confirm('是否确认删除报表配置编号为"' + IDs + '"的数据项？').then(function() {
        return delReport(IDs);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('report/report/export', {
        ...this.queryParams
      }, `report_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
