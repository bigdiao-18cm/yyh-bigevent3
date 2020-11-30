$(function() {
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;

    // 把请求参数单独抽离出来作为query对象
    //  以后发送请求，按照对应的query即可获取到数据
    let query = {
        pagenum: 1, // 页码值, 默认加载第一页的数据
        pagesize: 2, // 每页显示多少条数据
        cate_id: "", // 文章分类的 Id
        state: "", // 文章的状态，可选值有：已发布、草稿
    };

    // 发送ajax获取对应的文章列表
    getList();

    function getList() {
        $.ajax({
            url: "/my/article/list",
            data: query,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败！");
                }

                let htmlStr = template("trTpl", res);
                $("tbody").html(htmlStr);

                // 渲染展示分页功能
                renderPage(res.total);
            },
        });
    }

    // 定义分页渲染函数
    function renderPage(total) {
        // 执行一个laypage实例
        laypage.render({
            curr: query.pagenum, // 当前分页的页码
            limit: query.pagesize, // 每页多少条
            elem: "pageBox", // 注意，这里的 test1 是 ID，不用加 # 号
            count: total, // 数据总数，从服务端得到
            limits: [1, 2, 3, 5, 10],
            layout: ["count", "limit", "prev", "page", "next", "skip"],
            jump: function(obj, first) {
                // obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); // 得到每页显示的条数
                // console.log(first); // true  是否为分页初始渲染

                // jump触发执行的时机
                // 1. 分页初始渲染会触发执行一次， 此时first参数为true
                // 2. 点击分页的时候，jump也会触发执行，此时first参数为undefined

                // 步骤：
                // 点击分页，需要修改query对象的pagenum的值，修改为obj.curr
                // 重新发送ajax请求
                query.pagenum = obj.curr;
                // 修改query对象的每页多少条 （pagesize属性的值）
                query.pagesize = obj.limit;
                // 坑：如果以下代码直接这样写，会让ajax不停的发
                // getList();
                // 解决方案：初始渲染分页效果的时候，jump函数会执行，但是不要执行getList函数

                if (!first) {
                    // 点击的时候会让if成立
                    // console.log("点击了");
                    getList();
                }
            },
        });
    }

    // 补零函数
    const paddZero = (n) => (n < 10 ? "0" + n : n);

    // 美化时间
    // 1. 往模板中导入过滤器函数
    template.defaults.imports.formatTime = function(time) {
        // time ==> 需要处理的数据
        // return 处理好的数据

        let d = new Date(time);
        let y = d.getFullYear();
        let m = paddZero(d.getMonth() + 1);
        let day = paddZero(d.getDate());

        let h = paddZero(d.getHours());
        let mm = paddZero(d.getMinutes());
        let s = paddZero(d.getSeconds());

        return `${y}-${m}-${day} ${h}:${mm}:${s}`;
    };

    // 2. 在模板中来使用过滤器函数 {{数据 | 过滤器函数名}}

    // 获取分类类别的数据
    $.ajax({
        url: "/my/article/cates",
        success: function(res) {
            // 使用ES6的反引号来把数据渲染到下拉框中
            let htmlStr = ""; // 装option的html字符串
            let data = res.data;

            // 遍历数组，数据结合option创建出来
            data.forEach((item) => {
                htmlStr += `
            <option value="${item.Id}">${item.name}</option>
          `;
            });

            // 将创建的option添加到下拉框中
            $("[name=cate_id]").append(htmlStr);
            // 需要手动更新form表单（重新渲染下即可）
            form.render();
        },
    });

    // 处理筛选功能
    // 思路：
    //  1. 点击筛选按钮会触发form的submit事件
    //  2. 需要修改query对象的文章分类的id 和文章的state状态
    //  3. 发送ajax请求获取到对应的数据

    // 1.
    $("#form").on("submit", function(e) {
        e.preventDefault();

        // 修改query对象的cate_id ==> 文章分类的id
        // console.log($("[name=cate_id]").val(), $("[name=state]").val());
        query.cate_id = $("[name=cate_id]").val();
        query.state = $("[name=state]").val();

        // 发送ajax请求
        getList();
    });

    // 删除功能
    $("tbody").on("click", ".delBtn", function() {
        // 获取id的值
        let id = $(this).attr("data-id");

        // 以下代码解决删除功能的bug
        // 需要做个判断，判断tbody中的删除按钮的个数是否为1，如果为1，意味着请求发送成功，该页面中就没有了数据，需要将pagenum - 1（展示上一页数据）
        // 注意：pagenum最小值为1

        if ($(".delBtn").length === 1) {
            // 如果为1，意味着请求发送成功，该页面中就没有了数据，需要将pagenum - 1（展示上一页数据）
            // query.pagenum = query.pagenum === 1 ? 1 : query.pagenum - 1;

            if (query.pagenum === 1) {
                query.pagenum = 1;
            } else {
                query.pagenum = query.pagenum - 1;
            }
        }

        $.ajax({
            url: "/my/article/delete/" + id,
            success: function(res) {
                console.log("🚀 ~ file: art_list.js ~ line 145 ~ res", res);

                if (res.status !== 0) {
                    return layer.msg("删除失败！");
                }

                layer.msg("删除成功！");
                // 还需要重新获取所有文章列表
                getList();
            },
        });
    });

    // 编辑功能
    $("tbody").on("click", ".editBtn", function() {
        // 获取id的值
        let id = $(this).attr("data-id");

        // 跳转修改文章的页面(拼接到url地址后面)
        location.href = "/article/art_edit.html?id=" + id;
    });
});