<template>
    <div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="issue" label="期数">
            </el-table-column>
            <el-table-column prop="adviceNum" label="建议号码">
            </el-table-column>
            <el-table-column prop="winNum" label="结果号码">
            </el-table-column>
            <el-table-column prop="win" label="胜/负">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.win === '0'" type="danger">胜</el-tag>
                    <el-tag v-if="scope.row.win === '1'">负</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" :formatter="formatterTime" label="创建时间">
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[5, 10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>

<script>
    import { parseTime } from "@/utils/index";
    export default {
        props: ["name"],
        data() {
            return {
                currentPage: 1,
                pageSize: 5,
                total: 0,
                tableData: []
            }
        },
        methods: {
            formatterTime(value) {
                return parseTime(value.createTime, "{y}-{m}-{d} {h}:{i}:{s}");
            },
            formatter(value) {
                if (value.win === "0") {
                    return "胜";
                } else {
                    return "挂";
                }
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.tableInit();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.tableInit();
            },
            tableInit(type) {
                if (!type) {
                    type = this.name;
                }
                let data = {};
                data.pageSize = this.pageSize;
                data.startIndex = this.currentPage;
                data.parmas = type;
                this.$store
                    .dispatch("dataSource/getDataSourceByType", data)
                    .then(responese => {
                        this.total = responese.totalNum;
                        this.tableData = responese.items;
                    })
                    .catch(error => {
                        this.$message.error({
                            message: error.message ? error.message : "操作失败"
                        });
                    });
            }
        }
    }
</script>