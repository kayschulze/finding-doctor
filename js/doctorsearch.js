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
    let phraseArray = phrase.split(" ");
    let filledPhrase = phraseArray.join("%20");

    return filledPhrase;
  }

  searchMedicalIssue(medicalCondition, specialty, searchLimit, doctorName) {
    medicalCondition = this.fillSpace(medicalCondition);
    
    let promise = new Promise(function(resolve, reject) {

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

    promise.then(function(response) {
      let doctorResponse = JSON.parse(response);
      let dataArray = doctorResponse.data;
      dataArray.forEach(function(data) {
        let practicesArray = data.practices;
        practicesArray.forEach(function(practice) {
          let profileArray = data.profile;
          console.log(profileArray);

          $('.output').append(`<ul><li>Name: Dr. ${profileArray.first_name} ${profileArray.last_name}</li>`);

          // Display elements of location Visit Address
          let practiceAddress = practice.visit_address;
          $('.output').append(`<li>Practice Name: ${practice.name}</li>`);
          $('.output').append(`<li>Practice Location:</li><li> ${practiceAddress.street}</li>`);
          $('.output').append(`<li>${practiceAddress.city}, ${practiceAddress.state} ${practiceAddress.zip}</li><br></ul>`);
        });
      });
    }, function(error) {
      $('.showErrors').text(`There was an error: ${error.message}`);
    });
  }
}
