$(function() {
    let form = layui.form
    let layer = layui.layer

    // 表单校验
    form.verify({
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        // 校验原密码与新密码是否一致
        newPwd: function(value) {
            let oldPwd = $("[name=oldPwd]").val()
            console.log(oldPwd, value);

            if (value === oldPwd) {
                return "新密码不能和原密码一样"
            }
        },
        // 校验两次输入的密码是否一致
        samePwd: function(value) {
            let newPwd = $("[name=newPwd]").val()
            console.log(newPwd, value);

            if (value !== newPwd) {
                return "新密码和确认密码不一样"
            }
        }
    });

    // 提交form表单 ==> 密码重置
    let $form = $("#pwdForm");
    $form.on("submit", function(e) {
        e.preventDefault();

        let data = $(this).serialize();

        $.ajax({
            url: "/my/updatepwd",
            type: "POST",
            data,
            success: function(res) {
                console.log(res);

                if (res.status !== 0) {
                    return layer.msg("重置密码失败 " + res.message);
                }

                layer.msg("重置密码成功!");

                // 重置表单中的密码框内容
                $form.get(0).reset();
            },
        });
    });
})