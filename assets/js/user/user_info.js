$(function() {

    let form = layui.form
    let layer = layui.layer

    getInfo()

    function getInfo() {
        $.ajax({
            url: "/my/userinfo",
            success: function(res) {
                // console.log(res);

                if (res.status !== 0) {
                    return layer.msg("获取用户基本信息失败！")
                }

                // 获取信息成功，把响应回来的数据填充到form中
                //给表单赋值
                form.val("userForm", res.data);
            }
        })
    }
    // 重置功能
    $("#resetBtn").click(function(e) {
        e.preventDefault()

        getInfo()
    })

    // 修改功能
    $("#userForm").submit(function(e) {
            e.preventDefault()

            let data = $(this).serialize()
                // console.log(data);

            $.ajax({
                url: "/my/userinfo",
                type: "POST",
                data,
                success: function(res) {
                    console.log(res);

                    if (res.status !== 0) {
                        return layer.msg("修改用户信息失败！")
                    }
                    layer.msg("修改用户信息成功！")

                    // 通过window.parent来获取到父页面（index.html）
                    window.parent.gettouxnic()
                }
            })
        })
        // 表单校验
    form.verify({
        nickname: function(value, item) {
            console.log(value);
            if (value.length > 6) {
                return "字符长度必须在1~6字符之间"
            }
        }
    });
})