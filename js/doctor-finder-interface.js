import { DoctorSearch } from './../js/doctorsearch.js';
import { apiKey } from './../.env';

$(function() {
  $('#searchBetterDoctorForm').submit(function(event) {
    event.preventDefault();
    $('.output').text("");

    let newMedicalCondition = $('#medicalConditionInput').val();
    let newSpecialty = $('#specialtyInput').val();
    let newSearchLimit = $('#searchLimitInput').val();
    let newDoctorName = $('#doctorNameInput').val();

    $('#medicalConditionInput').val("");
    $('#specialtyInput').val("");
    $('#searchLimitInput').val("");
    $('#doctorNameInput').val("");

    let newDoctorSearch = new DoctorSearch(newMedicalCondition, newSpecialty, newSearchLimit, newDoctorName);


    newDoctorSearch.searchMedicalIssue(newMedicalCondition, newSpecialty, newSearchLimit, newDoctorName);

  });
});
