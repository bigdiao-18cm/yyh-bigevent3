$(function() {
    let form = layui.form
    let layer = layui.layer

    // 发布文章的状态
    let state = ''

    // 获取类别
    $.ajax({
        url: "/my/article/cates",
        success: function(res) {
            // ES6 ``
            let htmlStr = "";

            res.data.forEach((item) => {
                htmlStr += `
              <option value="${item.Id}">${item.name}</option>
            `;
            });

            // 把option添加到下拉框中
            $("[name=cate_id]").append(htmlStr);
            // 坑：需要让form重新渲染
            form.render();
        },
    });
    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择封面功能
    $('#chooseBtn').click(function() {
        // 模拟点击了文件域
        $("#file").click()
    })

    // 选择好了之后更换封面
    $("#file").on("change", function() {

        // console.log("yyh好帅");
        // 获取用户需要的图片
        let file = this.files[0]

        let newImgURL = URL.createObjectURL(file)

        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 点击发布文章 存为草稿 修改文章的状态
    $('#pubBtn').click(function() {
        state = '已发布'
    })
    $('#pubBtn2').click(function() {
        state = '草稿'
    })

    // 提交form表单数据
    $("#form").on("submit", function(e) {
        e.preventDefault()

        // 裁切的图片转换成对应的文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob((blob) => { // 将 Canvas 画布上的内容，转化为文件对象

                // 收集表单数据
                // let data = $(this).serialize()  // 不行
                // 由于此接口涉及到文件上传的功能，因此提交的请求体，必须是 FormData 格式

                let fd = new FormData(this) // 参数需要是form这个DOM对象

                //fd实例对象可以通过append方法来追加数据
                // fd.append('key', value) 
                fd.append('state', state)

                // 收集封面数据
                fd.append('cover_img', blob)

                // fd可以使用forEach方法遍历，查看form的数据
                fd.forEach(item => console.log(item));

                // 得到文件对象后，进行后续的操作
                pubApp(fd)
            })
    })

    // 发送ajax实现发表文章
    function pubApp(fd) {
        $.ajax({
            url: "/my/article/add",
            type: "POST",
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res);

                if (res.status !== 0) {
                    return layer.msg("发布文章失败！");
                }

                layer.msg("发布文章成功！");
                // 跳转页面到文章列表页面
                location.href = "/article/art_list.html";
            },
        });
    }
})