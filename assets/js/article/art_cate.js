$(function() {
    let layer = layui.layer;
    let form = layui.form;

    // 获取文章类别
    getCate()

    function getCate() {
        $.ajax({
            url: "/my/article/cates",
            success: function(res) {
                // 把数据 + 模板结合起来得到html字符串 ==> 放到tbody中显示
                let htmlStr = template("trTpl", res);
                // 往tbody中填充htmlStr
                $("tbody").html(htmlStr);
            },
        })
    }

    // 添加类别按钮
    let index // index变量保存弹出层的索引
    $("#btnAdd").click(function() {
        index = layer.open({
            // 弹出层
            type: 1, // 页面层

            area: "500px", // 页面宽度

            // 标题
            title: "添加文章分类",

            // 内容 ==> 来源于addForm这个script标签中的内容，注意这里使用的是html方法() ==> 可以获取到标签
            content: $("#addForm").html(),
        });
        //拿到的index是一个重要的凭据，它是诸如layer.close(index)等方法的必传参数。
    })

    // 确认添加
    $("body").on("submit", "#form", function(e) {
        e.preventDefault()

        let data = $(this).serialize()

        $.ajax({
            url: "/my/article/addcates",
            type: "POST",
            data,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return "新增文章分类失败！"
                }
                layer.msg("新增文章分类成功！")

                // 1. 弹出层关闭掉
                layer.close(index)

                // 2. 重新获取所有文章分类
                getCate()
            }
        })
    })

    // 编辑按钮的点击功能
    let editIndex // editIndex存编辑的弹出层的索引
    $("tbody").on("click", ".editBtn", function() {
        let id = $(this).attr('data-id')

        // console.log(id);
        editIndex = layer.open({
            // 弹出层
            type: 1, // 页面层

            area: "500px", // 页面宽度

            // 标题
            title: "修改文章分类",

            // 内容 ==> 来源于addForm这个script标签中的内容，注意这里使用的是html方法() ==> 可以获取到标签
            content: $("#editFormTpl").html(),
        })
        $.ajax({
            url: "/my/article/cates/" + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类数据失败！")
                }

                // 把数据添加到form表单中
                form.val("editForm", res.data)
            }
        })
    })

    // 编辑的form表单的确认修改功能
    $("body").on("submit", "#editForm", function(e) {
        e.preventDefault()

        let data = $(this).serialize()

        $.ajax({
            url: "/my/article/updatecate",
            type: 'POST',
            data,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("更新分类信息失败！")
                }
                layer.msg("更新分类信息成功！")

                // 1. 弹出层关闭掉
                layer.close(editIndex)

                // 2. 重新获取所有文章分类
                getCate()
            }
        })
    })

    // 删除功能
    $("tbody").on("click", ".delBtn", function() {
        let id = $(this).attr("data-id")

        $.ajax({
            url: "/my/article/deletecate/" + id,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("删除文章分类失败！")
                }
                layer.msg("删除文章分类成功！")

                // 重新获取所有文章分类
                getCate()
            }
        })
    })
})