import { apiKey } from './../.env';

export class DoctorSearch {
  constructor (medicalCondition, specialty, searchLimit, doctorName) {
    this.medicalCondition = medicalCondition;
    this.specialty = specialty;
    this.searchLimit = searchLimit;
    this.doctorName = doctorName;
  }

  getMedicalCondition() {
    return this.medicalCondition;
  }

  fillSpace(phrase) {
    if (phrase == null) {
      return "";
    }
    let phraseArray = phrase.split(" ");
    let filledPhrase = phraseArray.join("%20");

    return filledPhrase;
  }

  // formatPhoneType(phonetype) {
  //   let typeArray = phonetype.split("_");
  //   typeArray.forEach(function(word) {
  //     word[0].toUpperCase();
  //   });
  //
  //   return typeArray.join(" ");
  // }

  searchMedicalIssue(medicalCondition, specialty, searchLimit, doctorName) {
    medicalCondition = this.fillSpace(medicalCondition);
    specialty = this.fillSpace(searchLimit);
    doctorName = this.fillSpace(doctorName);

    let promiseMedicalIssue = new Promise(function(resolve, reject) {

      let request = new XMLHttpRequest();

      let url = `https://api.betterdoctor.com/2016-03-01/doctors?query=${medicalCondition}&location=wa-seattle&sort=distance-asc&skip=0&limit=${searchLimit}&specialty=${specialty}&Name=${doctorName}&user_key=${apiKey}`;

      request.onload = function() {
        if (this.status === 200) {
          resolve(request.response);
        }
        else {
          reject(Error(request.statusText));
        }
      };
      request.open("GET", url, true);
      request.send();

    });

    promiseMedicalIssue.then(function(response) {
      let doctorResponse = JSON.parse(response);
      let dataArray = doctorResponse.data;

      if (dataArray.length < 1) {
        $('.output').append(`<ul><li>No Doctors Found.</li></ul>`);
      }

      dataArray.forEach(function(data) {
        let practicesArray = data.practices;

        practicesArray.forEach(function(practice) {
          let profileArray = data.profile;

          $('.output').append(`<ul><li>Name: Dr. ${profileArray.first_name} ${profileArray.last_name}</li>`);

          // Display elements of location Visit Address
          let practiceAddress = practice.visit_address;
          $('.output').append(`<li>Practice Name: ${practice.name}</li>`);
          $('.output').append(`<li>Practice Location:</li><li> ${practiceAddress.street}</li>`);
          $('.output').append(`<li>${practiceAddress.city}, ${practiceAddress.state} ${practiceAddress.zip}</li>`);

          let practicePhones = practice.phones;
          practicePhones.forEach(function(phone) {
            //let phoneType = this.formatPhoneType(phone.type);
            $('.output').append(`<li>${phone.type}: ${phone.number}</li>`);
          });

          if (practice.email == null) {
            $('.output').append(`<li>No Email Available</li>`);
          }
          else {
            $('.output').append(`<li>Email: ${practice.email}</li>`);
          }

          if (practice.website == null) {
            $('.output').append(`<li>No Website Available</li>`);
          }
          else {
            $('.output').append(`<li>Website: ${practice.website}</li>`);
          }

          if (practice.accepts_new_patients == true) {
            $('.output').append(`<li>Accepts New Patients</li><br></ul>`);
          }
          else {
            $('.output').append(`<li>Does Not Accept New Patients</li><br></ul>`);
          }
        });
      });
    }, function(error) {
      $('.showErrors').text(`There was an error: ${error.message}`);
    });
  }

  searchSpecialty(medicalCondition, specialty, searchLimit, doctorName) {
    medicalCondition = this.fillSpace(medicalCondition);
    specialty = this.fillSpace(searchLimit);
    doctorName = this.fillSpace(doctorName);

    let promiseSpecialty = new Promise(function(resolve, reject) {

      let request = new XMLHttpRequest();

      let url = `https://api.betterdoctor.com/2016-03-01/doctors?query=${medicalCondition}&location=wa-seattle&sort=distance-asc&skip=0&limit=${searchLimit}&specialty=${specialty}&Name=${doctorName}&user_key=${apiKey}`;

      request.onload = function() {
        if (this.status === 200) {
          resolve(request.response);
        }
        else {
          reject(Error(request.statusText));
        }
      };
      request.open("GET", url, true);
      request.send();

    });

    promiseSpecialty.then(function(response) {
      let doctorResponse = JSON.parse(response);
      let dataArray = doctorResponse.data;

      dataArray.forEach(function(data) {
        let practicesArray = data.practices;

        if (practicesArray.length < 1) {
          $('.output').append(`<ul><li>No Doctors Found.</li></ul>`);
        }

        practicesArray.forEach(function(practice) {
          let practiceSpecialties = practice.specialties;
          if (specialty == practiceSpecialties.uid || specialty == practiceSpecialties.name || specialty == practiceSpecialties.category || specialty == practiceSpecialties.actor || specialty == practiceSpecialties.actors) {
            let profileArray = data.profile;

            $('.output').append(`<ul><li>Name: Dr. ${profileArray.first_name} ${profileArray.last_name}</li>`);

            // Display elements of location Visit Address
            let practiceAddress = practice.visit_address;
            $('.output').append(`<li>Practice Name: ${practice.name}</li>`);
            $('.output').append(`<li>Practice Location:</li><li> ${practiceAddress.street}</li>`);
            $('.output').append(`<li>${practiceAddress.city}, ${practiceAddress.state} ${practiceAddress.zip}</li>`);

            let practicePhones = practice.phones;
            practicePhones.forEach(function(phone) {
              //let phoneType = this.formatPhoneType(phone.type);
              $('.output').append(`<li>${phone.type}: ${phone.number}</li>`);
            });

            if (practice.email != null) {
              $('.output').append(`<li>Email: ${practice.email}</li>`);
            }
            else {
              $('.output').append(`<li>No Email Available</li>`);
            }

            let thisWebsite = practice.website;
            if (thisWebsite == 'undefined') {
              $('.output').append(`<li>No Website Available</li>`);
            }
            else {
              $('.output').append(`<li>Website: ${thisWebsite}</li>`);
            }

            if (practice.accepts_new_patients == true) {
              $('.output').append(`<li>Accepts New Patients</li><br></ul>`);
            }
            else {
              $('.output').append(`<li>Does Not Accept New Patients</li><br></ul>`);
            }
          }
        });
      });
    }, function(error) {
      $('.showErrors').text(`There was an error: ${error.message}`);
    });
  }
}
