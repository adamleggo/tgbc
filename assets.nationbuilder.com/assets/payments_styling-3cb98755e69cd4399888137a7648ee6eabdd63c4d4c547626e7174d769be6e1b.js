(function() {
  var stripeFonts = {};
  var googleKey = 'AIzaSyCCOU0NUKc65rzK0EdE-6XNdE68x6mGnD8';
  var googleApiUrl = 'https://www.googleapis.com/webfonts/v1/webfonts?key=' + googleKey;
  var documentReady = false;
  var optionsSet = false;

  var elementsBaseDefaults,
      elementsVariationStyleOverrides,
      elementBaseDefaults,
      elementVariationStyleOverrides;

  $(document).ready(function(){
    documentReady = true;
    if (optionsSet) {
      NB.EventHub.dispatch('nb.payments.options.ready');
    }
  });

  $.ajax({
    url: googleApiUrl,
    method: 'GET',
    error: function(error) {
      console.error('Fonts failed. Initiating Stripe with default fonts.');
      setStyleOptions(error);
      setOptions(elementBaseDefaults, elementVariationStyleOverrides, 'defaultElementOptions');
      optionsSet = true;
      if (documentReady) {
        NB.EventHub.dispatch('nb.payments.options.ready');
      }
    },
    success: function(data) {
      stripeFonts = data;
      setStyleOptions();
      setOptions(elementsBaseDefaults, elementsVariationStyleOverrides, 'defaultElementsOptions');
      setOptions(elementBaseDefaults, elementVariationStyleOverrides, 'defaultElementOptions');
      optionsSet = true;
      if (documentReady) {
        NB.EventHub.dispatch('nb.payments.options.ready');
      }
    }
  });

  function isMobile() {
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
      return true;
    } else {
      return false;
    }
  } 

  function setStyleOptions(error) {
    if (error) {
      elementBaseDefaults = {
        aware: {
          style: {
            base: {
              fontFamily: 'Montserrat',
              lineHeight: '30px',
              '::placeholder': {
              color: '#555',
              fontSize: '14px'
              }
            },
            invalid: {
              color: '#999'
            }
          }
        },
        action: {
          style: {
            base: {
              fontFamily: 'Lato',
              lineHeight: '45px',
              color: 'rgba(2,0,78,0.8)',
              '::placeholder': {
                color: 'rgba(2,0,78,0.3)',
                fontSize: '14px'
              }
            },
            invalid: {
              color: 'rgba(2,0,78,0.8)',
              '::placeholder': {
                color: 'rgba(2,0,78,0.3)'
              }
            }
          }
        },
        cityzen: {
          style: {
            base: {
              fontFamily: 'Bitter',
              lineHeight: '20px',
              color: '#000',
              '::placeholder': {
                color: '#000',
                fontSize: '13px'
              }
            },
            invalid: {
              color: '#000'
            }
          }
        },
        collective: {
          style: {
            base: {
              fontFamily: 'Open Sans',
              lineHeight: '26px',
              fontSize: '16px',
              color: '#2F2F2F',
              '::placeholder': {
                color: '#2F2F2F',
                fontSize: '16px'
              }
            },
            invalid: {
              color: '#2F2F2F'
            }
          }
        },
        headliner: {
          style: {
            base: {
              iconColor: '#FFF',
              fontFamily: 'Open Sans',
              lineHeight: '22px',
              color: '#FFF',
              '::placeholder': {
                color: '#FFF',
                fontSize: '15px'
              }
            },
            invalid: {
              color: '#FFF'
            }
          }
        },
        presence: {
          style: {
            base: {
              fontFamily: 'Crimson Text',
              fontSize: isMobile() ? '14px' : '20px',
              lineHeight: '25px',
              color: '#2F2F2F',
              '::placeholder': {
                color: '#2F2F2F'
              }
            },
            invalid: {
              color: '#2F2F2F'
            }
          }
        },
        publish: {
          style: {
            base: {
              fontFamily: 'Droid Serif',
              fontSize: '14px',
              lineHeight: '20px',
              color: '#222',
              '::placeholder': {
                color: '#222'
              }
            },
            invalid: {
              color: '#222'
            }
          }
        },
        verve: {
          style: {
            base: {
              fontFamily: 'Lato',
              fontSize: isMobile() ? '14px' : '20px',
              lineHeight: '31px',
              color: '#505050',
              '::placeholder': {
                color: '#505050'
              }
            },
            invalid: {
              color: '#505050'
            }
          }
        },
        victory_2: {
          style: {
            base: {
              fontFamily: 'Droid Serif',
              fontSize: '14px',
              lineHeight: '18px',
              color: '#222',
              '::placeholder': {
                color: '#222'
              }
            },
            invalid: {
              color: '#222'
            }
          }
        }
      };
      elementVariationStyleOverrides = {
        action: {
          style_earth: {
            style: {
              base: {
                color: '#626260',
                '::placeholder': {
                  color: 'rgba(98,98,96,0.5)'
                }
              },
              invalid: {
                color: '#626260',
                '::placeholder': {
                  color: 'rgba(98,98,96,0.5)'
                }
              }
            }
          },
          style_black: {
            style: {
              base: {
                color: 'rgba(0,0,0,0.8)',
                '::placeholder': {
                  color: 'rgba(0,0,0,0.4)'
                }
              },
              invalid: {
                color: 'rgba(0,0,0,0.8)',
                '::placeholder': {
                  color: 'rgba(0,0,0,0.4)'
                }
              }
            }
          },
          style_modern: {
            style: {
              base: {
                color: 'rgba(24,13,53,0.8)',
                '::placeholder': {
                  color: 'rgba(24,13,53,0.6)'
                }
              },
              invalid: {
                color: 'rgba(24,13,53,0.8)',
                '::placeholder': {
                  color: 'rgba(24,13,53,0.6)'
                }
              }
            }
          },
          style_patriot: {
            style: {
              base: {
                color: 'rgba(34,34,75,0.8)',
                '::placeholder': {
                  color: 'rgba(34,34,75,0.3)'
                }
              },
              invalid: {
                color: 'rgba(34,34,75,0.8)',
                '::placeholder': {
                  color: 'rgba(34,34,75,0.3)'
                }
              }
            }
          }
        },
        collective: {
          style_army_green: {
            style: {
              base: {
                color: '#2E2D2F',
                '::placeholder': {
                  color: '#2E2D2F'
                }
              },
              invalid: {
                color: '#2E2D2F'
              }
            }
          },
          style_blue: {
            style: {
              base: {
                iconColor: '#FFF',
                fontFamily: 'Noticia Text',
                color: '#FFF',
                '::placeholder': {
                  color: '#FFF'
                }
              },
              invalid: {
                color: '#FFF'
              }
            }
          },
          style_blue_green: {
            style: {
              base: {
                color: '#FFF',
                '::placeholder': {
                  color: '#FFF'
                }
              },
              invalid: {
                color: '#FFF'
              }
            }
          },
          style_dark_blue: {
            style: {
              base: {
                color: '#616161',
                '::placeholder': {
                  color: '#616161'
                }
              },
              invalid: {
                color: '#616161'
              }
            }
          },
          style_pink: {
            style: {
              base: {
                fontFamily: 'Noticia Text',
                color: '#616161',
                '::placeholder': {
                  color: '#616161'
                }
              },
              invalid: {
                color: '#616161'
              }
            }
          },
          style_purple: {
            style: {
              base: {
                fontFamily: 'Noticia Text',
                color: '#3d2474',
                '::placeholder': {
                  color: '#3d2474'
                }
              },
              invalid: {
                color: '#3d2474'
              }
            }
          },
          style_red: {
            style: {
              base: {
                fontFamily: 'Noticia Text',
                color: '#616161',
                '::placeholder': {
                  color: '#616161'
                }
              },
              invalid: {
                color: '#616161'
              }
            }
          }
        },
        headliner : {
          style_blue_orange: {
            style: {
              base: {
                color: '#F2D779',
                '::placeholder': {
                  color: '#F2D779'
                }
              },
              invalid: {
                color: '#F2D779'
              }
            }
          },
          style_blue_starry: {
            style: {
              base: {
                color: '#00B4CD',
                '::placeholder': {
                  color: '#00B4CD'
                }
              },
              invalid: {
                color: '#00B4CD'
              }
            }
          },
          style_purple_mint: {
            style: {
              base: {
                color: '#CCFFD1',
                '::placeholder': {
                  color: '#CCFFD1'
                }
              },
              invalid: {
                color: '#CCFFD1'
              }
            }
          },
          style_salmon_print: {
            style: {
              base: {
                iconColor: '#FF6666',
                color: '#F66',
                '::placeholder': {
                  color: '#F66'
                }
              },
              invalid: {
                color: '#F66'
              }
            }
          },
          style_white: {
            style: {
              base: {
                iconColor: '#000',
                color: '#000',
                '::placeholder': {
                  color: '#000'
                }
              },
              invalid: {
                color: '#000'
              }
            }
          },
          style_yellow_starry: {
            style: {
              base: {
                color: '#F2D779',
                '::placeholder': {
                  color: '#F2D779'
                }
              },
              invalid: {
                color: '#F2D779'
              }
            }
          }
        },
        publish: {
          style_black: {
            style: {
              base: {
                fontFamily: 'Bitter'
              }
            }
          },
          style_blue: {
            style: {
              base: {
                fontFamily: 'Lato'
              }
            }
          },
          style_green: {
            style: {
              base: {
                fontFamily: 'Raleway'
              }
            }
          },
          style_navy: {
            style: {
              base: {
                fontFamily: 'Lato'
              }
            }
          },
          style_red_white_and_blue: {
            style: {
              base: {
                fontFamily: 'Droid Serif'
              }
            }
          },
          style_turquoise: {
            style: {
              base: {
                fontFamily: 'Open Sans'
              }
            }
          }
        },
        presence: {
          style_blue: {
            style: {
              base: {
                fontFamily: 'Tinos',
                color: '#727272',
                '::placeholder': {
                  color: '#727272'
                }
              },
              invalid: {
                color: '#727272'
              }
            }
          },
          style_brown: {
            style: {
              base: {
                fontFamily: 'Tinos',
                color: '#757467',
                '::placeholder': {
                  color: '#757467'
                }
              },
              invalid: {
                color: '#757467'
              }
            }
          },
          style_coffee: {
            style: {
              base: {
                fontFamily: 'Source Sans Pro'
              }
            }
          },
          style_green: {
            style: {
              base: {
                fontFamily: 'Source Sans Pro',
                color: '#727272',
                '::placeholder': {
                  color: '#727272'
                }
              },
              invalid: {
                color: '#727272'
              }
            }
          },
          style_pink: {
            style: {
              base: {
                color: '#464552',
                '::placeholder': {
                  color: '#464552'
                }
              },
              invalid: {
                color: '#464552'
              }
            }
          },
          style_yellow: {
            style: {
              base: {
                color: '#272727',
                '::placeholder': {
                  color: '#272727'
                }
              },
              invalid: {
                color: '#272727'
              }
            }
          },
          style_purple: {
            style: {
              base: {
                fontFamily: 'Open Sans'
              }
            }
          },
        },
        verve: {
          style_gray: {
            style: {
              base: {
                fontFamily: 'Source Sans Pro',
                color: '#424242',
                '::placeholder': {
                  color: '#424242'
                }
              },
              invalid: {
                color: '#424242'
              }
            }
          },
          style_green: {
            style: {
              base: {
                fontFamily: 'Source Sans Pro',
                color: '#3D3D3D',
                '::placeholder': {
                  color: '#3D3D3D'
                }
              },
              invalid: {
                color: '#3D3D3D'
              }
            }
          },
          style_light_blue: {
            style: {
              base: {
                color: '#484848',
                '::placeholder': {
                  color: '#484848'
                }
              },
              invalid: {
                color: '#484848'
              }
            }
          },
          style_mint: {
            style: {
              base: {
                fontFamily: 'Source Sans Pro',
                color: '#3D3D3D',
                '::placeholder': {
                  color: '#3D3D3D'
                }
              },
              invalid: {
                color: '#3D3D3D'
              }
            }
          },
          style_purple: {
            style: {
              base: {
                fontFamily: 'Source Sans Pro',
                color: '#0d4655',
                '::placeholder': {
                  color: '#0d4655'
                }
              },
              invalid: {
                color: '#0d4655'
              }
            }
          },
          style_retro: {
            style: {
              base: {
                color: '#3D3D3D',
                '::placeholder': {
                  color: '#3D3D3D'
                }
              },
              invalid: {
                color: '#3D3D3D'
              }
            }
          },
          style_red_white_and_blue: {
            style: {
              base: {
                fontFamily: 'Tinos'
              }
            }
          }
        }
      };
    } else {
      elementsBaseDefaults = {
          action: {
            fonts: [getGoogleFont('Lato')]
          },
          aware: {
            fonts: [getGoogleFont('Montserrat')]
          },
          cityzen: {
            fonts: [getGoogleFont('Bitter')]
          },
          collective: {
            fonts: [getGoogleFont('Open Sans'),
                    getGoogleFont('Noticia Text')]
          },
          headliner: {
            fonts: [getGoogleFont('Open Sans')]
          },
          presence: {
            fonts: [getGoogleFont('Crimson Text'),
                    getGoogleFont('Open Sans'),
                    getGoogleFont('Tinos'),
                    getGoogleFont('Source Sans Pro')]
          },
          publish: {
            fonts: [getGoogleFont('Droid Serif'),
                    getGoogleFont('Bitter'),
                    getGoogleFont('Lato'),
                    getGoogleFont('Raleway'),
                    getGoogleFont('Open Sans')]
          },
          verve: {
            fonts: [getGoogleFont('Lato'),
                    getGoogleFont('Source Sans Pro'),
                    getGoogleFont('Tinos')]
          },
          victory_2: {
            fonts: [getGoogleFont('Droid Serif')]
          }
        };
      elementsVariationStyleOverrides = {};
      elementBaseDefaults = {
        aware: {
          style: {
            base: {
              fontFamily: 'Montserrat',
              lineHeight: '30px',
              '::placeholder': {
              color: '#555',
              fontSize: '14px'
              }
            },
            invalid: {
              color: '#999'
            }
          }
        },
        action: {
          style: {
            base: {
              fontFamily: 'Lato',
              lineHeight: '45px',
              color: 'rgba(2,0,78,0.8)',
              '::placeholder': {
                color: 'rgba(2,0,78,0.3)',
                fontSize: '14px'
              }
            },
            invalid: {
              color: 'rgba(2,0,78,0.8)',
              '::placeholder': {
                color: 'rgba(2,0,78,0.3)'
              }
            }
          }
        },
        cityzen: {
          style: {
            base: {
              fontFamily: 'Bitter',
              lineHeight: '20px',
              color: '#000',
              '::placeholder': {
                color: '#000',
                fontSize: '13px'
              }
            },
            invalid: {
              color: '#000'
            }
          }
        },
        collective: {
          style: {
            base: {
              fontFamily: 'Open Sans',
              lineHeight: '26px',
              fontSize: '16px',
              color: '#2F2F2F',
              '::placeholder': {
                color: '#2F2F2F',
                fontSize: '16px'
              }
            },
            invalid: {
              color: '#2F2F2F'
            }
          }
        },
        headliner: {
          style: {
            base: {
              iconColor: '#FFF',
              fontFamily: 'Open Sans',
              lineHeight: '22px',
              color: '#FFF',
              '::placeholder': {
                color: '#FFF',
                fontSize: '15px'
              }
            },
            invalid: {
              color: '#FFF'
            }
          }
        },
        presence: {
          style: {
            base: {
              fontFamily: 'Crimson Text',
              fontSize: isMobile() ? '14px' : '20px',
              lineHeight: '25px',
              color: '#2F2F2F',
              '::placeholder': {
                color: '#2F2F2F'
              }
            },
            invalid: {
              color: '#2F2F2F'
            }
          }
        },
        publish: {
          style: {
            base: {
              fontFamily: 'Droid Serif',
              fontSize: '14px',
              lineHeight: '20px',
              color: '#222',
              '::placeholder': {
                color: '#222'
              }
            },
            invalid: {
              color: '#222'
            }
          }
        },
        verve: {
          style: {
            base: {
              fontFamily: 'Lato',
              fontSize: isMobile() ? '14px' : '20px',
              lineHeight: '31px',
              color: '#505050',
              '::placeholder': {
                color: '#505050'
              }
            },
            invalid: {
              color: '#505050'
            }
          }
        },
        victory_2: {
          style: {
            base: {
              fontFamily: 'Droid Serif',
              fontSize: '14px',
              lineHeight: '18px',
              color: '#222',
              '::placeholder': {
                color: '#222'
              }
            },
            invalid: {
              color: '#222'
            }
          }
        }
      };
      elementVariationStyleOverrides = {
        action: {
          style_earth: {
            style: {
              base: {
                color: '#626260',
                '::placeholder': {
                  color: 'rgba(98,98,96,0.5)'
                }
              },
              invalid: {
                color: '#626260',
                '::placeholder': {
                  color: 'rgba(98,98,96,0.5)'
                }
              }
            }
          },
          style_black: {
            style: {
              base: {
                color: 'rgba(0,0,0,0.8)',
                '::placeholder': {
                  color: 'rgba(0,0,0,0.4)'
                }
              },
              invalid: {
                color: 'rgba(0,0,0,0.8)',
                '::placeholder': {
                  color: 'rgba(0,0,0,0.4)'
                }
              }
            }
          },
          style_modern: {
            style: {
              base: {
                color: 'rgba(24,13,53,0.8)',
                '::placeholder': {
                  color: 'rgba(24,13,53,0.6)'
                }
              },
              invalid: {
                color: 'rgba(24,13,53,0.8)',
                '::placeholder': {
                  color: 'rgba(24,13,53,0.6)'
                }
              }
            }
          },
          style_patriot: {
            style: {
              base: {
                color: 'rgba(34,34,75,0.8)',
                '::placeholder': {
                  color: 'rgba(34,34,75,0.3)'
                }
              },
              invalid: {
                color: 'rgba(34,34,75,0.8)',
                '::placeholder': {
                  color: 'rgba(34,34,75,0.3)'
                }
              }
            }
          }
        },
        collective: {
          style_army_green: {
            style: {
              base: {
                color: '#2E2D2F',
                '::placeholder': {
                  color: '#2E2D2F'
                }
              },
              invalid: {
                color: '#2E2D2F'
              }
            }
          },
          style_blue: {
            style: {
              base: {
                iconColor: '#FFF',
                fontFamily: 'Noticia Text',
                color: '#FFF',
                '::placeholder': {
                  color: '#FFF'
                }
              },
              invalid: {
                color: '#FFF'
              }
            }
          },
          style_blue_green: {
            style: {
              base: {
                color: '#FFF',
                '::placeholder': {
                  color: '#FFF'
                }
              },
              invalid: {
                color: '#FFF'
              }
            }
          },
          style_dark_blue: {
            style: {
              base: {
                color: '#616161',
                '::placeholder': {
                  color: '#616161'
                }
              },
              invalid: {
                color: '#616161'
              }
            }
          },
          style_pink: {
            style: {
              base: {
                fontFamily: 'Noticia Text',
                color: '#616161',
                '::placeholder': {
                  color: '#616161'
                }
              },
              invalid: {
                color: '#616161'
              }
            }
          },
          style_purple: {
            style: {
              base: {
                fontFamily: 'Noticia Text',
                color: '#3d2474',
                '::placeholder': {
                  color: '#3d2474'
                }
              },
              invalid: {
                color: '#3d2474'
              }
            }
          },
          style_red: {
            style: {
              base: {
                fontFamily: 'Noticia Text',
                color: '#616161',
                '::placeholder': {
                  color: '#616161'
                }
              },
              invalid: {
                color: '#616161'
              }
            }
          }
        },
        headliner : {
          style_blue_orange: {
            style: {
              base: {
                color: '#F2D779',
                '::placeholder': {
                  color: '#F2D779'
                }
              },
              invalid: {
                color: '#F2D779'
              }
            }
          },
          style_blue_starry: {
            style: {
              base: {
                color: '#00B4CD',
                '::placeholder': {
                  color: '#00B4CD'
                }
              },
              invalid: {
                color: '#00B4CD'
              }
            }
          },
          style_purple_mint: {
            style: {
              base: {
                color: '#CCFFD1',
                '::placeholder': {
                  color: '#CCFFD1'
                }
              },
              invalid: {
                color: '#CCFFD1'
              }
            }
          },
          style_salmon_print: {
            style: {
              base: {
                iconColor: '#FF6666',
                color: '#F66',
                '::placeholder': {
                  color: '#F66'
                }
              },
              invalid: {
                color: '#F66'
              }
            }
          },
          style_white: {
            style: {
              base: {
                iconColor: '#000',
                color: '#000',
                '::placeholder': {
                  color: '#000'
                }
              },
              invalid: {
                color: '#000'
              }
            }
          },
          style_yellow_starry: {
            style: {
              base: {
                color: '#F2D779',
                '::placeholder': {
                  color: '#F2D779'
                }
              },
              invalid: {
                color: '#F2D779'
              }
            }
          }
        },
        publish: {
          style_black: {
            style: {
              base: {
                fontFamily: 'Bitter'
              }
            }
          },
          style_blue: {
            style: {
              base: {
                fontFamily: 'Lato'
              }
            }
          },
          style_green: {
            style: {
              base: {
                fontFamily: 'Raleway'
              }
            }
          },
          style_navy: {
            style: {
              base: {
                fontFamily: 'Lato'
              }
            }
          },
          style_red_white_and_blue: {
            style: {
              base: {
                fontFamily: 'Droid Serif'
              }
            }
          },
          style_turquoise: {
            style: {
              base: {
                fontFamily: 'Open Sans'
              }
            }
          }
        },
        presence: {
          style_blue: {
            style: {
              base: {
                fontFamily: 'Tinos',
                color: '#727272',
                '::placeholder': {
                  color: '#727272'
                }
              },
              invalid: {
                color: '#727272'
              }
            }
          },
          style_brown: {
            style: {
              base: {
                fontFamily: 'Tinos',
                color: '#757467',
                '::placeholder': {
                  color: '#757467'
                }
              },
              invalid: {
                color: '#757467'
              }
            }
          },
          style_coffee: {
            style: {
              base: {
                fontFamily: 'Source Sans Pro'
              }
            }
          },
          style_green: {
            style: {
              base: {
                fontFamily: 'Source Sans Pro',
                color: '#727272',
                '::placeholder': {
                  color: '#727272'
                }
              },
              invalid: {
                color: '#727272'
              }
            }
          },
          style_pink: {
            style: {
              base: {
                color: '#464552',
                '::placeholder': {
                  color: '#464552'
                }
              },
              invalid: {
                color: '#464552'
              }
            }
          },
          style_yellow: {
            style: {
              base: {
                color: '#272727',
                '::placeholder': {
                  color: '#272727'
                }
              },
              invalid: {
                color: '#272727'
              }
            }
          },
          style_purple: {
            style: {
              base: {
                fontFamily: 'Open Sans'
              }
            }
          },
        },
        verve: {
          style_gray: {
            style: {
              base: {
                fontFamily: 'Source Sans Pro',
                color: '#424242',
                '::placeholder': {
                  color: '#424242'
                }
              },
              invalid: {
                color: '#424242'
              }
            }
          },
          style_green: {
            style: {
              base: {
                fontFamily: 'Source Sans Pro',
                color: '#3D3D3D',
                '::placeholder': {
                  color: '#3D3D3D'
                }
              },
              invalid: {
                color: '#3D3D3D'
              }
            }
          },
          style_light_blue: {
            style: {
              base: {
                color: '#484848',
                '::placeholder': {
                  color: '#484848'
                }
              },
              invalid: {
                color: '#484848'
              }
            }
          },
          style_mint: {
            style: {
              base: {
                fontFamily: 'Source Sans Pro',
                color: '#3D3D3D',
                '::placeholder': {
                  color: '#3D3D3D'
                }
              },
              invalid: {
                color: '#3D3D3D'
              }
            }
          },
          style_purple: {
            style: {
              base: {
                fontFamily: 'Source Sans Pro',
                color: '#0d4655',
                '::placeholder': {
                  color: '#0d4655'
                }
              },
              invalid: {
                color: '#0d4655'
              }
            }
          },
          style_retro: {
            style: {
              base: {
                color: '#3D3D3D',
                '::placeholder': {
                  color: '#3D3D3D'
                }
              },
              invalid: {
                color: '#3D3D3D'
              }
            }
          },
          style_red_white_and_blue: {
            style: {
              base: {
                fontFamily: 'Tinos'
              }
            }
          }
        }
      };
    }
  }

  function getGoogleFont(fontFamily) {
    var fontArray = $.grep(stripeFonts.items, function(obj) {
      return obj.family === fontFamily;
    });
    googleFont = fontArray[0];
    if (googleFont) {
      var src = ('url(' + googleFont.files.regular + ')').replace('http:', 'https:');
      return {family: googleFont.family, src: src};
    } else {
      console.log('Unable to load font ', fontFamily)
    }
  }

  function setOptions(baseDefaults, variationStyleOverrides, option) {
    var theme = NB.Liquid.Theme;
    var base = (theme.parent ? theme.parent : theme.name).toLowerCase();
    var variation = theme.variation;
    var variationExists = !!variationStyleOverrides[base] && !!variationStyleOverrides[base][variation];
    var recursive = true;
    var baseStyles = baseDefaults[base];
    var variationStyles = variationExists ? variationStyleOverrides[base][variation] : {};

    NB.payments[option] = $.extend(recursive, {}, baseStyles, variationStyles);
  }
})();
