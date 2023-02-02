import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import './KakaoLogin.css';

function KakaoLogin() {
    const location = useLocation();
    const kakao = window.Kakao;
    const Kakao_REST = process.env.REACT_APP_KAKAO_Rest_Api_Key;
    const Kakao_REDIRECT = process.env.REACT_APP_KAKAO_Redirect_URI;

    const [clickLogin, setClickLogin] = useState(false);
    const [access, setAccess] = useState();
    const [id, setId] = useState();
    const [refresh, setRefresh] = useState();
    const [nickname, setNickname] = useState();
    const [profile, setProfile] = useState();
    const [thumbnail, setThumbnail] = useState();
    const [age, setAge] = useState();

    const handleKakaoLogin = () => {
        setClickLogin(!clickLogin);
    };

    useEffect(() => {
        const params = location.search.split('=')[1]; // =을 기준으로 나눠서 = 다음에 해당하는 정보 추출
        if (params) {
            console.log('///////////params\n', params);
            axios.post(`https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${Kakao_REST}&redirect_uri=${Kakao_REDIRECT}&code=${params}`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }).then((res) => { // success
                console.log('success', res);
                setAccess(res.data.access_token);
                setId(res.data.id_token);
                setRefresh(res.data.refresh_token);
                console.log(res.data.access_token, res.data.id_token, res.data.refresh_token);

                kakao.init(Kakao_REST);
                kakao.Auth.setAccessToken(res.data.access_token);
                kakao.API.request({
                    url: "/v2/user/me",
                    success: ({ kakao_account }) => {
                        console.log('kakao account : ', kakao_account);
                        setNickname(kakao_account.profile.nickname); // 필수
                        setProfile(kakao_account.profile.profile_image_url); // 필수
                        setThumbnail(kakao_account.profile.thumbnail_image_url); // 필수
                        if (kakao_account.age_range) setAge(kakao_account.age_range); // 선택
                    }
                });
            }).catch((err) => { // error
                console.log('error', err);
            });
        }
    }, []);

    useEffect(() => {
        if (clickLogin) {
            window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${Kakao_REST}&redirect_uri=${Kakao_REDIRECT}&response_type=code`;
        }
    }, [clickLogin]);

    return (
        <>
            <img src={require("../images/kakaoLogin.png")} className={'kakaoImg'} onClick={handleKakaoLogin} alt={"kakao"} />
        </>
    );
}

export default KakaoLogin;
