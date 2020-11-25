$(function() {

    let layer = layui.layer

    // 获取用户头像和昵称基本信息
    $.ajax({
        url: "/my/userinfo",
        /* 
        // 设置请求头信息
        headers: {
            Authorization: localStorage.getItem("token")
        } ,*/
        success: function(res) {
            // console.log(res);

            if (res.status !== 0) {
                return layer.msg('获取用户基本信息失败' + res.message, { icon: 5 })
            }

            layer.msg('获取用户基本信息成功！' + res.message, { icon: 6 })

            // 处理头像和昵称
            //1. 先名字（展示昵称，再是用户名）

            let name = res.data.nickname || res.data.username
                // console.log(name, name[0].toUpperCase());

            let wenzi = name[0].toUpperCase()

            $("#welcome").text("欢迎" + name)

            //2. 头像
            // 根据res的data的user_pic来做不同处理
            if (res.data.user_pic) {
                // 用户头像 展示用户头像 隐藏文字头像
                $(".layui-nav-img").show().attr("str", res.data.user_pic)
                $(".text-avatar").hide()
            } else {
                // 没有 用户头像 展示用户头像 隐藏文字头像 ==> 文字头像文字来源于name的第一个字符（大写）
                $(".layui-nav-img").hide()
                $(".text-avatar").text(wenzi).show()
            }
        },
        // complete: function(xhr) {
        //     // 请求完成就会执行的函数
        //     // 形参可以获取到xhr对象
        //     console.log(xhr);

        //     if (xhr.responseJSON.status === 1 && xhr.responseJSON.message === "身份认证失败！") {
        //         // 回到登录页面重新登录
        //         // 把token也清除掉
        //         localStorage.removeItem("token")
        //         location.href = "login.html"
        //     }
        // }
    })

    // 退出功能
    $("#logoutBtn").click(function() {
        layer.confirm(
            '确定要退出登录？', { icon: 3, title: '提 示' },
            function(index) {
                // 该函数会在点击确认的时候执行
                // console.log("点击确认了");
                // 退出登录要做的事情，应该和登录时候做的事情是相反的

                // 1.需要将存储到本地中token删除掉（localStorage.removeitme(key)）
                localStorage.removeItem("token")

                // 2.跳转登录页面（login.html）
                location.href = "login.html"

                layer.close(index); // 关闭当前的询问框
            });
    })
})