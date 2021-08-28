//we gonna write test in javascript
//truffle come bundelled with mocha testing framework and chai assertion library
//which will provide everything we need to test our smart contract
var Election = artifacts.require("./Election.sol");
contract("Election" , function(accounts){
//this is declaration of our smart contract
// and the accounts written over there enjecs all the accounts present in the user environment



//test no 1.
//this is to test that the total number of candidates are 2
//###############################################################################################
// this it and other contract else stuff we are getting from mocha testing framework 
//but the assert kinda is from chai assertion library
it("initializes with two candidates",function(){
    return Election.deployed().then(function(instance){
        return instance.candidatesCount();
    }).then(function(count){
        assert.equal(count,2);
    });
});
//###############################################################################################

//test no 2.
// we will be testing that the candidates are initiallised correctly
//this is to check that the name is correct or the vote count is correct 
//all stuff which is usefull during the initiallisation.
//here it will be all clear like how the chain functions work
//the chain functions are those consisting of .then value and before it 
//we have to return something that will be its argument
//###############################################################################################
it("it initializes the candidates with the correct value",function(){
    return Election.deployed().then(function(instance){
        electionInstance = instance;
        return electionInstance.candidates(1);
    }).then(function(candidate){
        assert.equal(candidate[0],1,"contain the correct id");
        assert.equal(candidate[1],"Candidate 1","contains the correct name");
        assert.equal(candidate[2],0,"contain the correct votescount");
        return electionInstance.candidates(2);
    }).then(function(candidate){
        assert.equal(candidate[0],2,"contain the correct id");
        assert.equal(candidate[1],"Candidate 2","contains the correct name");
        assert.equal(candidate[2],0,"contain the correct votescount");
    })
});
//###############################################################################################
// test no 3
// here we have two tests one is we have to check weather the voter count is increased
// second we have to check that this account address is added to our account 
//###############################################################################################
it("it allows voter to cast a vote",function(){
    return Election.deployed().then(function(instance){
        electionInstance = instance;
        candidateId = 1;
        return electionInstance.vote(candidateId,{from: accounts[0]});
    }).then(function(receipt){
        assert.equal(receipt.logs.length, 1, "an event was triggered");
        assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
        assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
        return electionInstance.voters(accounts[0]);
    }).then(function(voted){
        assert(voted,"the voter was marked as voted");
        return electionInstance.candidates(candidateId);
    }).then(function(candidate){
        var voteCount = candidate[2];
        assert.equal(voteCount,1,"increaments the candidate's vote count")
    })
});
//###############################################################################################
// THESE ARE THE TESTS FOR NEW REQUIREMENTS ADDEDD

//###############################################################################################
// test no 4
//we will vote with the id 99 and then inspect the error message
// in the particular inspection we will check the keyword "revert in  the code"
//if its is present then fine otherwise there is some other problem with code
// and also we will check that vote count is not incremented
//###############################################################################################
it("throws an exception for invalid candiates", function () {
    return Election.deployed().then(function (instance) {
      electionInstance = instance;
      return electionInstance.vote(99, { from: accounts[1] })
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    }).then(function (candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(function (candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
    });
  });
//###############################################################################################


//###############################################################################################
// test no 5
// this is also same first we will vote once with some valid candidate
// and then we will vote again with the same candidate and inspect the error
// here also the error message string should consist of the keywork "revert" 
// and also check for the both candidates that the votes are not doubled or you can say that they should be one
//###############################################################################################
it("throws an exception for double voting", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      candidateId = 2;
      electionInstance.vote(candidateId, { from: accounts[1] });
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "accepts first vote");
      // Try to vote again
      return electionInstance.vote(candidateId, { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
    });
  });
//###############################################################################################
});
