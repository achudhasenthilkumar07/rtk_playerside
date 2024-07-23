import './App.css';
import logo from "../src/assets/images/logopy.svg"
import { useEffect, useState } from 'react';
import { useGetFacilityMutation, useGetSportQuery, usePostLoginMutation } from './feature/counter/Playerside';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

  const [postLogin, login] = usePostLoginMutation();
  const [getFacility, facility] = useGetFacilityMutation();
  const { data: sportData, error: sportError, isLoading: sportLoading, refetch } = useGetSportQuery();
  const [sportsTitle, setSportsTitle] = useState([])
  const [sports, setSports] = useState([])
  const [showCard, setShowCard] = useState(false);
  const [show, setShow] = useState(false);
  const [token, setToken] = useState('');
  const [user, setUser] = useState({
    userName: '',
    password: ''
  });
  const [facilityAndCount, setFacilityAndCount] = useState([]);

  const toggleCard = () => {
    setShowCard(!showCard);
  };

  const showPassword = () => {
    setShow(!show);
  };

  useEffect(() => {
    if (sports.length > 0) {
      retrieveFacility();
    }
  }, [sports]);


  const retrieveFacility = async () => {
    if (!sports) {
      console.log('No data in sportsList');
      return;
    }
    sports?.map(async (sprtandcnt) => {
      console.log('token', token)
      const { data } = await getFacility(sprtandcnt?.id);
      console.log("count", data)
      const facJSON = {
        title: sprtandcnt.title,
        count: data,
        url: sprtandcnt.url
      };
      setFacilityAndCount(fc => [...fc, facJSON])
    });
  };


  useEffect(() => {
    const retrieveSports = async () => {
      if (token && sportsTitle.length === 0) {
        const { data } = await refetch();
        data?.map(spt => {
          const sportDetailJSON = {
            id: spt.sport.id,
            title: spt.sport.title,
            url: spt.url
          }
          setSports(sport => [...sport, sportDetailJSON]);
          return sportDetailJSON
        })
        data?.map(spt => setSportsTitle(spt1 => [...spt1, spt.sport.title]));
      }
    }
    retrieveSports()
  }, [token])


  const loginUser = async () => {
    if (user.userName && user.password) {
      try {
        const loginData = await postLogin(user);
        if (loginData?.data && loginData?.data.accessToken) {
          setToken(loginData?.data.accessToken);
          localStorage.setItem("token", loginData.data.accessToken);
          toast.success("Logged in successfully!");
          toggleCard();
          setUser({
            userName: '',
            password: ''
          })
        } else {
          console.error('No valid accessToken found in login data.');
          toast.error("No valid access token found in login data.");
        }
      } catch (error) {
        console.error('Error during login:', error);
        toast.error("Error during login. Please try again later.");
      }
    } else {
      console.error('Username or password is missing.');
      toast.error("Please provide username and password.");
    }
    if (facility?.error) {
      toast.error("Facility not found try again later.");
    }
    if (sportError?.error) {
      toast.error("Error during fetching sports. Please try again later.");
    }
  }





  return (
    <div className='app'>
      <ToastContainer autoClose={3000} position='top-center' />
      <div className='container-fluid p-0 '>
        <div className='header-img'>
          <div className='card-overlay'>
            <div className='row '>
              <div className=' col d-flex justify-content-center align-items-start'><img className="imgLogo mt-5 pt-5 pb-3" src={logo} alt="logo" /></div>
              <div className=' col d-flex justify-content-center align-items-end'></div>
              <div className=' col d-flex justify-content-center align-items-start '>
                <button type="button" class="logInBt btn btn-danger ps-3 mt-extra pe-3 " onClick={toggleCard}>
                  Log in
                </button>
                {showCard && (
                  <div className='backdrop-background'>
                    <div className="card backdrop" style={{ width: '22rem', height: '27rem' }}>
                      <i class="bi bi-x fs-2" onClick={toggleCard}></i>
                      <div className="card-body pt-0">
                        <div>
                          <span>Email Address</span>
                          <input type='email' className='form-control' placeholder='Email Address' value={user.userName} onChange={(e) => setUser({ ...user, userName: e.target.value })} />
                        </div>
                        <div className='pass'>
                          <span>Password</span>
                          <div className='input-container d-flex'>
                            <input type={show ? 'text' : 'password'} className='form-control' placeholder='Password' value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
                            {show ? <i class="bi bi-eye" onClick={showPassword}></i> : <i class="bi bi-eye-slash" onClick={showPassword}></i>}
                          </div>
                        </div>
                        <span className='forget-pass'>Forget Password ?</span>
                        <button type="button" className="signIn btn btn-danger" onClick={loginUser}>
                          {login?.isLoading ? (
                            <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                          ) : (
                            'Sign in'
                          )}
                        </button>
                        <button type='button' className='or'>Or</button><br />
                        <div className='SignInW'>
                          <span className='ms-5 me-1'>Sign in with </span>
                          <i class="bi bi-facebook ms-3 fs-5"></i>
                          <i class="bi bi-google ms-3 fs-5"></i>
                          <i class="bi bi-apple ms-3 fs-5"></i>
                        </div>
                        <p className='line-black'>___________________________________</p>
                        <div>
                          <div className='d-flex'>
                            <span className='haveAccSportCen'>Don't have a account ? </span>
                            <span className='haveAccSportCen'>Are you a sport center ?</span>
                          </div>
                          <div className='d-flex'>
                            <span className='createAccPartWthUs'>Create account</span>
                            <span className='createAccPartWthUs'>Partner with us</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='row  mt-5'>
              <div className='col d-flex justify-content-center'> </div>
              <div className='col d-flex justify-content-center title title-lg title-md title-sm'> Book Venues, Coaches & Academies Nearby </div>
              <div className='col d-flex justify-content-center'> </div>
            </div>
            <div className='row'>
              <div className='col'> </div>
              <div className='col'><span className='line'>____________________________________________________________________________________________________</span></div>
              <div className='col'> </div>
            </div>
            <div className='row mt-4 mb-4'>
              <div className='col'></div>
              <div className='col d-flex justify-content-center  justify-content-around align-items-start options-title'>
                <button>Sport center</button>
                <button>Teamates</button>
                <button>Lessons</button>
              </div>
              <div className='col'></div>
            </div>
            <div className='row '>
              <div class="search-inputs">
                <div className='input-container'>
                  <i class="bi bi-geo-alt-fill iconImage"></i>
                  <input className='search-input' type="text" aria-label="Location" placeholder='Location'></input>
                </div>
                <div className='input-container'>
                  <i class="bi bi-award iconImage"></i>
                  <select className='sport-drop-down' aria-label="Sports" placeholder='Sports' defaultValue={'sports'}>
                    <option value="sports" disabled hidden>&nbsp; &nbsp; &nbsp; &nbsp;Sports &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</option>
                    {sportLoading?.isLoading ? (
                      <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                    ) : sportsTitle && sportsTitle?.map((sport, index) => (
                      <option key={index} value={sport}>{sport}</option>
                    ))}
                  </select>
                </div>
                <div className='input-container'>
                  <input id="datepicker" type="date" aria-label="Date" placeholder='Date' />
                </div>
                <div className='input-container'>
                  <input id="timepicker" type="time" aria-label="Time" placeholder='Time' />
                </div>
                <div>
                  <button className='search-button' type='submit'>
                    <i class="bi bi-search"></i>
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className='modal-content'>
            <div class="p-3 bg-light bg-gradient text-white">
              <div className='modal-body mt-3 mb-3 justify-content-between'>
                <p className='games-display'>Games & Entertainment</p>
                <p className='bal-display'> Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups. int, and publishing industries for previewing layouts and visual mockups.</p>
                {facilityAndCount.length > 0 ?
                  <div className='row'>
                    {facilityAndCount && facilityAndCount?.map((facAndCount, index) => {
                      return (<div key={index} className='col ms-3 pb-3'>
                        <div key={facAndCount?.id} class="card gametype text-center text-black  pointer " style={{ "width": "16rem" }}>
                          <img class="align-self-center pb-1 mt-3" src={facAndCount?.url} alt={facAndCount?.title} />
                          <div class="card-body">
                            <p class="card-text"><span className='fw-bold'>Sport: </span>{facAndCount?.title}</p>
                            <p class="card-text"><span className='fw-bold'>Facilities: </span>{facAndCount?.count}</p>
                          </div>
                        </div>
                      </div>)
                    })
                    }
                  </div>
                  : <div className='info-div d-flex'><i class="bi bi-info-circle fs-2" /><p className='info-p'>Please log in to view the facility counts for each sport.</p></div>
                }
              </div>
            </div>
          </div>
        </div>
        <div className='row m-0'>
          <div className="footer-img" />
          <div className='footer black-footer'>
            <div className='footer-content'>
              <div className='playzeon'>
                <u className='color-white'>Playzeon</u>
              </div>
              <div className='links'>
                <p>About Us &nbsp; &nbsp; |</p>
                <p>Terms & Conditions  &nbsp; &nbsp; |</p>
                <p>Privacy  &nbsp; &nbsp; |</p>
                <p>Download App</p>
              </div>
              <div className='social-icons'>
                <i class="bi bi-facebook ms-3 fs-5"></i>
                <i class="bi bi-google ms-3 fs-5"></i>
                <i class="bi bi-apple ms-3 fs-5"></i>
              </div>
              <div className='line-separator'>
              <span className='line ms-2'>______________________________________________________________________________________________________________________________________________________________________________</span>
              </div>
              <div className='footer-bottom'>
                <p>We Play Real <i class="bi bi-c-square"></i> 2020. All Rights Reserved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
