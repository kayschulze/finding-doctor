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

      let medicalConditionField = '';
      let specialtyField = '';
      let doctorNameField = '';

      if (medicalCondition.length > 0) {
        medicalConditionField = 'query=' + medicalCondition;
      }

      if (specialtyField.length > 0) {
        specialtyField = '&specialty=' + specialty;
      }

      if (doctorNameField.length > 0) {
        doctorNameField = '&Name=' + doctorName;
      }

      let url = `https://api.betterdoctor.com/2016-03-01/doctors?${medicalConditionField}&location=wa-seattle&sort=distance-asc&skip=0&limit=${searchLimit}${specialtyField}${doctorNameField}&user_key=${apiKey}`;

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

        let profileArray = data.profile;
        $('.output').append(`<div class='row'><h2>Name: Dr. ${profileArray.first_name} ${profileArray.last_name}</h2></div>`);

        let dataSpecialty = data.specialties;
        dataSpecialty.forEach(function(specialty) {
          $('.output').append(`<div class='row'><div class='practiceColumn'><ul><li>Specialty:  ${specialty.name}</li>`);
          $('.output').append(`<li>Description:  ${specialty.description}</li>`);
          $('.output').append(`<li>Category:  ${specialty.category}</li></ul></div></div><br>`);
        });

        practicesArray.forEach(function(practice) {
          // Display elements of location Visit Address
          let practiceAddress = practice.visit_address;
          $('.output').append(`<div class='row'><div class='practiceColumn'><ul><li>Practice Name: ${practice.name}</li>`);
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
            $('.output').append(`<li>Accepts New Patients</li><br></ul></div>`);
          }
          else {
            $('.output').append(`<li>Does Not Accept New Patients</li><br></ul></div>`);
          }
          // $('.output').append(`</div>`);
        });
        $('.output').append(`</div>`);
      });
    }, function(error) {
      $('.showErrors').text(`There was an error: ${error.message}`);
    });
  }
}
