package umg.harcmistrz.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import umg.harcmistrz.Models.Role;
import umg.harcmistrz.Models.User;
import umg.harcmistrz.config.JwtService;
import umg.harcmistrz.exception.ApiRequestException;
import umg.harcmistrz.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole())
                .build();
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new ApiRequestException("Użytkownik o podanym adresie email już istnieje!");
        }
        else {
            userRepository.save(user);
        }
        var token = jwtService.generateToken(user.getEmail());
        return AuthenticationResponse.builder()
                .id(user.getId())
                .role(user.getRole())
                .token(token)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiRequestException("Użytkownik o podanym adresie email nie istnieje!"));
        var token = jwtService.generateToken(request.getEmail());
        return AuthenticationResponse.builder()
                .id(user.getId())
                .role(user.getRole())
                .token(token)
                .build();
    }

    public AuthenticationResponse changePassword(ChangePasswordRequest changePasswordRequest){
        var user = userRepository.findByEmail(changePasswordRequest.getEmail())
                .orElseThrow(() -> new ApiRequestException("Użytkownik o podanym adresie email nie istnieje!"));

        if(passwordEncoder.matches(changePasswordRequest.getOldPassword(), user.getPassword())){
            user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
            userRepository.save(user);
            var token = jwtService.generateToken(user.getEmail());
            return AuthenticationResponse.builder()
                    .id(user.getId())
                    .role(user.getRole())
                    .token(token)
                    .build();
        }
        else {
            throw new ApiRequestException("Stare hasło nie jest poprawne!");
        }
    }
}
