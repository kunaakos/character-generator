import React from 'react';
import ReactDOM from 'react-dom';
import dedent from 'dedent';
import copy from 'clipboard-copy';
import './index.css';
import ClipboardSolid from './icons/ClipboardSolid';
import PenSolid from './icons/PenSolid';
import UserPlusSolid from './icons/UserPlusSolid';
import TrashSolid from './icons/TrashSolid';
import {
    AttributeGroup,
    AttributeGroupLabel,
    AttributeLabel,
    AttributeList,
    BoardContainer,
    CharacterCardColumn,
    CharacterCardContainer,
    CharacterCardRow,
    CharacterCardToolbar,
    Label,
    NameWrapper,
    Option,
    ToolbarButton,
    TopToolbar,
    TopToolbarButton,
    TopToolbarColumn,
    Select,
    SelectContainer
    } from './styles.js';
import {
    generateCharacter,
    reshuffle
} from './character';

function uppercaseFirstLetter(string) {

    return string
        ? string.charAt(0).toUpperCase() + string.slice(1)
        : false;
}

function determinerBefore(string) {

    return ['a', 'e', 'i', 'o', 'u'].includes(string.charAt(0)) ? 'an' : 'a';
}

function displayGender(age, gender) {

    switch (gender) {
        case 'cis male': return ['young', 'teenage'].includes(age) ? 'boy' : 'man';
        case 'cis female': return ['young', 'teenage'].includes(age) ? 'girl' : 'woman';
        case 'trans male': return ['young', 'teenage'].includes(age) ? 'trans boy' : 'trans man';
        case 'trans female': return ['young', 'teenage'].includes(age) ? 'trans girl' : 'trans woman';
        case 'genderfluid': return ['young', 'teenage'].includes(age) ? 'genderfluid child' : 'genderfluid person';
        case 'agender': return ['young', 'teenage'].includes(age) ? 'agender child' : 'agender person';
        default: return 'person';
    }
}

function Attribute(props) {
    return (
        <AttributeLabel onClick={props.onClick}>{props.value}</AttributeLabel>
    );
}

const CharacterCard = ({ deleteCharacter, reshuffle, character, isAttributeGroupBeingEdited, setAttributeGroupBeingEdited }) => {
    return (
        <CharacterCardContainer>
            <CharacterCardToolbar>
                <ToolbarButton onClick={() => copy(dedent(
                        `${character.givenName.text} ${character.familyName.text}
                        ${uppercaseFirstLetter(determinerBefore(character.age.text))} ${character.age.text} ${character.race.text} of ${character.ancestry.text} descent
                        Job: ${character.competency.text} ${character.job.text}
                        Appearance: ${character.appearance1.text}, ${character.appearance2.text}
                        Mood: ${character.mood.text}
                        Personality: ${character.personality1.text}, ${character.personality2.text}
                        Life goal: ${character.motivation.text}
                        Relationships: ${character.sexuality.text}, ${character.relationship.text}`
                        ))}>
                    <ClipboardSolid />
                </ToolbarButton>
                <ToolbarButton onClick={() => deleteCharacter()}>
                    <TrashSolid />
                </ToolbarButton>
            </CharacterCardToolbar>
            <NameWrapper>
                <Attribute name='givenName' onClick={() => reshuffle('givenName')} value={character.givenName.text} />
                {' '}
                <Attribute name='familyName' onClick={() => reshuffle('familyName')} value={character.familyName.text} />
            </NameWrapper>
            <AttributeGroup>
                {uppercaseFirstLetter(determinerBefore(character.age.text))}
                {' '}
                <Attribute name='age' onClick={() => reshuffle('age')} value={character.age.text} />
                {' '}
                <Attribute name='race' onClick={() => reshuffle('race')} value={character.race.text} />
                {' '}
                <Attribute name='gender' onClick={() => reshuffle('gender')} value={displayGender(character.age.text, character.gender.text)} />
                {' '}
                of <Attribute name='ancestry' onClick={() => reshuffle('ancestry')} value={character.ancestry.text} /> descent
            </AttributeGroup>
            <CharacterCardRow>
                <CharacterCardColumn>
                    <AttributeGroup isBeingEdited={isAttributeGroupBeingEdited('job')}>
                        <AttributeGroupLabel onClick={() => setAttributeGroupBeingEdited('job')}>Job <PenSolid /></AttributeGroupLabel>
                        <Attribute name='competency' onClick={() => reshuffle('competency')} value={uppercaseFirstLetter(character.competency.text)} />
                        {' '}
                        <Attribute name='job' onClick={() => reshuffle('job')} value={character.job.text} />
                    </AttributeGroup>
                    <AttributeGroup isBeingEdited={isAttributeGroupBeingEdited('appearance')}>
                        <AttributeGroupLabel onClick={() => setAttributeGroupBeingEdited('appearance')}>Appearance <PenSolid /></AttributeGroupLabel>
                        <Attribute name='appearance1' onClick={() => reshuffle('appearance1')} value={uppercaseFirstLetter(character.appearance1.text)} />,
                        {' '}
                        <Attribute name='appearance2' onClick={() => reshuffle('appearance2')} value={character.appearance2.text} />
                    </AttributeGroup>
                </CharacterCardColumn>
                <CharacterCardColumn>
                    <AttributeGroup isBeingEdited={isAttributeGroupBeingEdited('mood')}>
                        <AttributeGroupLabel onClick={() => setAttributeGroupBeingEdited('mood')}>Mood <PenSolid /></AttributeGroupLabel>
                        <Attribute name='mood' onClick={() => reshuffle('mood')} value={character.mood.text} />
                    </AttributeGroup>
                    <AttributeGroup isBeingEdited={isAttributeGroupBeingEdited('personality')}>
                        <AttributeGroupLabel onClick={() => setAttributeGroupBeingEdited('personality')}>Personality <PenSolid /></AttributeGroupLabel>
                        <Attribute name='personality1' onClick={() => reshuffle('personality1')} value={uppercaseFirstLetter(character.personality1.text)} /> and
                        {' '}
                        <Attribute name='personality2' onClick={() => reshuffle('personality2')} value={character.personality2.text} />
                    </AttributeGroup>
                </CharacterCardColumn>
                <CharacterCardColumn>
                    <AttributeGroup isBeingEdited={isAttributeGroupBeingEdited('motivation')}>
                        <AttributeGroupLabel onClick={() => setAttributeGroupBeingEdited('motivation')}>Life goal <PenSolid /></AttributeGroupLabel>
                        <Attribute name='motivation' onClick={() => reshuffle('motivation')} value={character.motivation.text} />
                    </AttributeGroup>
                    <AttributeGroup isBeingEdited={isAttributeGroupBeingEdited('relationships')}>
                        <AttributeGroupLabel onClick={() => setAttributeGroupBeingEdited('relationships')}>Relationships <PenSolid /></AttributeGroupLabel>
                        <AttributeList>
                            <Attribute name='sexuality' onClick={() => reshuffle('sexuality')} value={uppercaseFirstLetter(character.sexuality.text)} />,
                            {' '}
                            <Attribute name='relationship' onClick={() => reshuffle('relationship')} value={character.relationship.text} />
                        </AttributeList>
                    </AttributeGroup>
                </CharacterCardColumn>
            </CharacterCardRow>
        </CharacterCardContainer>
    )
}

class Board extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            characters: {},
            worldName: 'Asa',
            characterBeingEdited: false,
            attributeGroupBeingEdited: false
        }

        this.handleWorldChange = this.handleWorldChange.bind(this);
    }

    addCharacter() {
        let newCharacter = generateCharacter(this.state.worldName);
        this.setState({
            characters: {
                [Date.now()]: newCharacter,
                ...this.state.characters
            }
        });
    }

    deleteCharacter(uid) {
        const {
            [uid]: removedCharacter,
            ...newCharacters
        } = this.state.characters;

        this.setState({
            characters: newCharacters
        });
    }

    reshuffleAttribute(uid, attribute) {
        this.setState({
            characters: {
                ...this.state.characters,
                [uid]: reshuffle(this.state.worldName, this.state.characters[uid], attribute)
            }
        });
    }

    handleWorldChange(event) {
        switch (event.target.value) {
            case 'Cyberpunk / Near Future':
                this.setState({ worldName: 'Cyberpunk' });
                break;
            default:
                this.setState({ worldName: 'Asa' });
                break;
        }
    }

    getWorldDescriptiveName() {
        switch (this.state.worldName) {
            case 'Cyberpunk':

                return 'Cyberpunk / Near Future';
            default:
                
                return 'Asa (Homebrew Fantasy)';
        }
    }

    isAttributeGroupBeingEdited(attributeGroup) {
        console.log(`${attributeGroup} is being edited: ${(this.state.attributeGroupBeingEdited === attributeGroup)}`);

        return (this.state.attributeGroupBeingEdited === attributeGroup);
    }

    setAttributeGroupBeingEdited(attributeGroup) {
        console.log(attributeGroup);
        this.setState({
            attributeGroupBeingEdited: attributeGroup
        });
    }

    render() {

        return (
            <BoardContainer>
                <TopToolbar>
                    <TopToolbarColumn>
                        <SelectContainer>
                            <Label>World</Label>
                            <Select value={this.getWorldDescriptiveName()} onChange={this.handleWorldChange}>
                                <Option>Asa (Homebrew Fantasy)</Option>
                                <Option>Cyberpunk / Near Future</Option>
                            </Select>
                        </SelectContainer>
                    </TopToolbarColumn>
                    <TopToolbarColumn>
                        <TopToolbarButton onClick={() => this.addCharacter()}>
                            <UserPlusSolid /> Meet someone new
                        </TopToolbarButton>
                    </TopToolbarColumn>
                </TopToolbar>
                {Object.entries(this.state.characters)
                    .map(([uid, character]) => <CharacterCard
                        key={uid}
                        character={character}
                        reshuffle={(attribute) => this.reshuffleAttribute(uid, attribute)}
                        deleteCharacter={() => this.deleteCharacter(uid)}
                        isAttributeGroupBeingEdited={(attributeGroup) => this.isAttributeGroupBeingEdited(attributeGroup)}
                        setAttributeGroupBeingEdited={(attributeGroup) => this.setAttributeGroupBeingEdited(attributeGroup)}
                    />)
                }
            </BoardContainer> 
        );
    }
}

// ========================================

ReactDOM.render(
    <Board />,
    document.getElementById('root')
);
