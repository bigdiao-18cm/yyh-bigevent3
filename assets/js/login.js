$(function() {
    // 去注册账号
    $("#gotoRegi").click(function() {
        // 注册区域显示
        $(".regiBox").show()

        // 登入区域隐藏
        $(".loginBox").hide()
    })

    // 去登入账号
    $("#gotoLogin").click(function() {
        // 注册区域显示
        $(".loginBox").show()

        // 登入区域隐藏
        $(".regiBox").hide()
    })

    // 表单校验
    // 从layui中获取到form的功能
    let form = layui.form
    let layer = layui.layer

    layui.code
    form.verify({
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        // 再次确认表单的校验，需要和密码框的内容保持一致 ==> 函数写法
        repass: function(value) {
            //value：表单的值、item：表单的DOM对
            let pwd = $(".regiBox input[name=password]").val()

            console.log(pwd);

            if (value !== pwd) {
                return "两次输入的密码不一致！"
            }
        }
    });

    // 注册ajax代码
    $("#regiForm").on("submit", function(e) {
            e.preventDefault()

            let data = $(this).serialize()

            // 直接发送ajax请求
            $.ajax({
                type: "POST",
                url: "/api/reguser",
                data,
                success: function(res) {
                    console.log(res);

                    if (res.status != 0) {
                        return layer.msg("注册失败！" + res.message, { icon: 5 })
                    }
                    console.log('注册成功');
                    layer.msg("注册成功", { icon: 6 })

                    // 切换到登入页面
                    $("#gotoLogin").click()
                }
            })
        })
        // 登入ajax代码
    $("#loginForm").on("submit", function(e) {
        e.preventDefault()

        // 收集到登录ajax请求
        let data = $(this).serialize()

        // 直接发送ajax请求
        $.ajax({
            type: "POST",
            url: "/api/login",
            data,
            success: function(res) {
                console.log(res);

                // 登录失败
                if (res.status !== 0) {
                    return layer.msg('账号或者密码错误' + res.message, { icon: 5 });
                }
                // 登录成功
                // 1. 提示框 ==> layui.msg
                // layer.msg('登录成功！ 即将跳转页面' + res.message, { icon: 6 });

                // // 2. 需要将token存储到本地中（localStorage）
                // localStorage.setItem("token", res.token)

                // // 3. 跳转页面操作
                // location.href = "index.html"

                // 延时效果
                localStorage.setItem("token", res.token)

                layer.msg('登录成功！ 即将跳转页面' + res.message, { icon: 6, time: 2000 }, function() {
                    // 关闭后做的事情 ==> 跳转页面 
                    location.href = "index.html"
                });
            }
        })
    })
})