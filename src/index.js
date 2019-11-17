import React from 'react';
import ReactDOM from 'react-dom';
import { 
    AttributeGroup,
    AttributeLabel,
    CharacterSheetContainer,
    NameWrapper
    } from './styles.js';
import Asa from './asa';
import './index.css';

function DefaultAttribute(props) {

    return (
        <div className="attribute">
            <a href="#" onClick={props.onClick} className="attribute__name">
                {props.name}
            </a>
            <div className="attribute__value">
                {props.value}
            </div>
        </div>
    );
}

function Attribute(props) {
    
    return (
        <AttributeLabel onClick={props.onClick}>{props.value}</AttributeLabel>
    );
}

class CharacterSheet extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            gender: {
                name: 'gender',
                value: this.chooseValue(Asa.gender)
            },
            ancestry: {
                name: 'ancestry',
                value: this.chooseValue(Asa.ancestry)
            },
            age: {
                name: 'age',
                value: this.chooseValue(Asa.age)
            },
            motivation: {
                name: 'motivation',
                value: this.chooseValue(Asa.motivation)
            },
            usualMood: {
                name: 'usualMood',
                value: this.chooseValue(Asa.usualMood)
            },
            outlook: {
                name: 'outlook',
                value: this.chooseValue(Asa.outlook)
            },
            integrity: {
                name: 'integrity',
                value: this.chooseValue(Asa.integrity)
            },
            impulsiveness: {
                name: 'impulsiveness',
                value: this.chooseValue(Asa.impulsiveness)
            },
            boldness: {
                name: 'boldness',
                value: this.chooseValue(Asa.boldness)
            },
            agreeableness: {
                name: 'agreeableness',
                value: this.chooseValue(Asa.agreeableness)
            },
            interactivity: {
                name: 'interactivity',
                value: this.chooseValue(Asa.interactivity)
            },
            conformity: {
                name: 'conformity',
                value: this.chooseValue(Asa.conformity)
            }
        }
        this.state.sexuality = {
            name: 'sexuality',
            value: this.generateSexuality(Asa.sexuality, this.state.gender.value)
        }
        this.state.givenName = {
            name: 'givenName',
            value: this.generateGivenName(Asa.givenName, this.state.ancestry.value, this.state.gender.value)
        }
        this.state.familyName = {
            name: 'familyName',
            value: this.generateFamilyName(Asa.familyName, this.state.ancestry.value)
        }
        this.state.race = {
            name: 'race',
            value: this.generateRace(Asa.race, this.state.ancestry.value)
        }
    }

    handleClick(attribute) {
        this.reshuffle(attribute);
    }

    reshuffle(attribute) {
        let previous = this.state[attribute].value;
        switch(attribute) {
            case 'givenName':
                this.setState({
                    [attribute]: {
                        name: 'givenName',
                        value: this.generateGivenName(Asa.givenName, this.state.ancestry.value, this.state.gender.value, previous)
                    }
                });
                break;
            case 'familyName':
                this.setState({
                    [attribute]: {
                        name: 'familyName',
                        value: this.generateFamilyName(Asa.familyName, this.state.ancestry.value, previous)
                    }
                });
                break;
            case 'race':
                this.setState({
                    [attribute]: {
                        name: 'race',
                        value: this.generateRace(Asa.race, this.state.ancestry.value, previous)
                    }
                });
                break;
            case 'ancestry':
                this.setState({
                    [attribute]: {
                        name: 'ancestry',
                        value: this.chooseValue(Asa.ancestry, previous)
                    }
                }, () => {
                    this.reshuffle('givenName');
                    this.reshuffle('familyName');
                    this.reshuffle('race');
                });
                break;
            case 'gender':
                this.setState({
                    [attribute]: {
                        name: 'gender',
                        value: this.chooseValue(Asa.gender, previous)
                    }
                }, () => {
                    this.reshuffle('sexuality');
                    this.reshuffle('givenName');
                    this.reshuffle('familyName');
                });
                break;
            case 'sexuality':
                this.setState({
                    [attribute]: {
                        name: 'sexuality',
                        value: this.generateSexuality(Asa.sexuality, this.state.gender.value, previous)
                    }
                });
                break;
            default:
                this.setState({
                    [attribute]: {
                        name: attribute,
                        value: this.chooseValue(Asa[attribute], previous)
                    }
                });
        }
    }

    chooseValue(pool, oldValue) {
        // taking the last value out of the pool so we get a new one every time
        pool = pool.filter(option => option.name !== oldValue);
        let sumWeights = 0;
        for (let index in pool) {
            //console.log("option.weight: " + pool[index].weight);
            sumWeights += pool[index].weight ? pool[index].weight : 1;
        }
        //console.log("sumWeights: " + sumWeights);
        let winner = Math.floor(Math.random() * sumWeights);
        //console.log("winner: " + winner);
        for (let index in pool) {
            winner -= pool[index].weight ? pool[index].weight : 1;
            //console.log("weight: " + pool[index].weight + ", winner is reduced to: " + winner)
            if (winner < 0) {
                return pool[index].name;
            }
        }
    }

    generateSexuality(options, gender, oldValue) {
        if (gender === 'Cis male' || gender === 'Trans male' || gender === 'Cis female' || gender === 'Trans female') { gender = 'MaleFemale'; }
        if (gender === 'Genderfluid' || gender === 'Agender') { gender = 'GenderfluidAgender'; }

        return this.chooseValue(options[gender], oldValue);
    }

    generateGivenName(options, ancestry, gender, oldValue) {
        if (gender === 'Cis male' || gender === 'Trans male') { gender = 'Masculine'; }
        if (gender === 'Cis female' || gender === 'Trans female') { gender = 'Feminine'; }
        if (gender === 'Genderfluid') { gender = (Math.random() >= 0.5) ? 'Masculine' : 'Feminine'; }
        //console.log(`name gender: ${gender}`);

        return this.chooseValue(options[ancestry][gender], oldValue);
    }

    generateFamilyName(options, ancestry, oldValue) {

        return this.chooseValue(options[ancestry], oldValue);
    }

    generateRace(options, ancestry, oldValue) {

        return this.chooseValue(options[ancestry], oldValue);
    }

    render() {

        return (
            <CharacterSheetContainer>
                <NameWrapper>
                    <Attribute name='givenName' onClick={() => this.handleClick('givenName')} value={this.state.givenName.value} />
                    {' '}
                    <Attribute name='familyName' onClick={() => this.handleClick('familyName')} value={this.state.familyName.value} />
                </NameWrapper>
                <AttributeGroup>
                    <Attribute name='gender' onClick={() => this.handleClick('gender')} value={this.state.gender.value} />
                    {' '}
                    <Attribute name='age' onClick={() => this.handleClick('age')} value={this.state.age.value} />
                    {' '}
                    <Attribute name='race' onClick={() => this.handleClick('race')} value={this.state.race.value} />
                    {' '}
                    from <Attribute name='ancestry' onClick={() => this.handleClick('ancestry')} value={this.state.ancestry.value} />,
                    {' '}
                    <Attribute name='sexuality' onClick={() => this.handleClick('sexuality')} value={this.state.sexuality.value} />
                </AttributeGroup>
                <AttributeGroup>
                    Motivation: <Attribute name='motivation' onClick={() => this.handleClick('motivation')} value={this.state.motivation.value} />
                </AttributeGroup>
                <AttributeGroup>
                    Usual mood: <Attribute name='usualMood' onClick={() => this.handleClick('usualMood')} value={this.state.usualMood.value} />
                </AttributeGroup>
                <AttributeGroup>
                    Personality traits:
                    <ul>
                        <li><Attribute name='outlook' onClick={() => this.handleClick('outlook')} value={this.state.outlook.value} /></li>
                        <li><Attribute name='integrity' onClick={() => this.handleClick('integrity')} value={this.state.integrity.value} /></li>
                        <li><Attribute name='impulsiveness' onClick={() => this.handleClick('impulsiveness')} value={this.state.impulsiveness.value} /></li>
                        <li><Attribute name='boldness' onClick={() => this.handleClick('boldness')} value={this.state.boldness.value} /></li>
                        <li><Attribute name='agreeableness' onClick={() => this.handleClick('agreeableness')} value={this.state.agreeableness.value} /></li>
                        <li><Attribute name='interactivity' onClick={() => this.handleClick('interactivity')} value={this.state.interactivity.value} /></li>
                        <li><Attribute name='conformity' onClick={() => this.handleClick('conformity')} value={this.state.conformity.value} /></li>
                    </ul>
                </AttributeGroup>
            </CharacterSheetContainer>
        );
    }
}

// ========================================

ReactDOM.render(
    <CharacterSheet />,
    document.getElementById('root')
);